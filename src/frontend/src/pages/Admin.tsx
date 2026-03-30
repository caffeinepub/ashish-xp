import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Edit2,
  Loader2,
  Plus,
  Save,
  ShieldAlert,
  Star,
  StarOff,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useActor } from "../hooks/useActor";
import {
  useAddFile,
  useDeleteFile,
  useGetFiles,
  useGetNotice,
  useSetFeatured,
  useSetNotice,
  useUpdateFile,
} from "../hooks/useQueries";
import type { FileItem } from "../hooks/useQueries";
import { hashPassword, isAdminUnlocked, setAdminUnlocked } from "../utils/auth";

const CATEGORIES = ["Editing Videos", "ZIP Files", "Presets", "Overlays"];

interface FileForm {
  title: string;
  category: string;
  thumbnailUrl: string;
  downloadUrl: string;
  featured: boolean;
}

const EMPTY_FORM: FileForm = {
  title: "",
  category: "Editing Videos",
  thumbnailUrl: "",
  downloadUrl: "",
  featured: false,
};

const CAT_COLORS: Record<string, string> = {
  "Editing Videos": "#16E0E6",
  "ZIP Files": "#B34BFF",
  Presets: "#4BFFA0",
  Overlays: "#FF4B9A",
};

export function Admin() {
  const navigate = useNavigate();
  const { actor } = useActor();

  // Admin auth
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [isAuthed, setIsAuthed] = useState(isAdminUnlocked);

  // File management
  const [showForm, setShowForm] = useState(false);
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  const [form, setForm] = useState<FileForm>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<bigint | null>(null);

  // Notice
  const [noticeText, setNoticeText] = useState("");
  const [noticeSaved, setNoticeSaved] = useState(false);

  const { data: files = [], isLoading: filesLoading } = useGetFiles();
  const { data: currentNotice = "" } = useGetNotice();
  const addFile = useAddFile();
  const updateFile = useUpdateFile();
  const deleteFile = useDeleteFile();
  const setFeatured = useSetFeatured();
  const setNotice = useSetNotice();

  useEffect(() => {
    if (currentNotice) setNoticeText(currentNotice);
  }, [currentNotice]);

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) return;
    setAdminLoading(true);
    setAdminError("");
    try {
      const hash = await hashPassword(adminPassword);
      const valid = await actor.verifyAdminPassword(hash);
      if (valid) {
        setAdminUnlocked();
        setIsAuthed(true);
      } else {
        setAdminError("Invalid admin password.");
      }
    } catch {
      setAdminError("Connection error.");
    } finally {
      setAdminLoading(false);
    }
  }

  function startAdd() {
    setEditingFile(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function startEdit(file: FileItem) {
    setEditingFile(file);
    setForm({
      title: file.title,
      category: file.category,
      thumbnailUrl: file.thumbnailUrl,
      downloadUrl: file.downloadUrl,
      featured: file.featured,
    });
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingFile(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingFile) {
      await updateFile.mutateAsync({
        id: editingFile.id,
        ...form,
      });
    } else {
      await addFile.mutateAsync({
        title: form.title,
        category: form.category,
        thumbnailUrl: form.thumbnailUrl,
        downloadUrl: form.downloadUrl,
      });
    }
    cancelForm();
  }

  async function handleDelete(id: bigint) {
    await deleteFile.mutateAsync(id);
    setDeleteConfirm(null);
  }

  async function handleToggleFeatured(file: FileItem) {
    await setFeatured.mutateAsync({ id: file.id, featured: !file.featured });
  }

  async function handleSaveNotice() {
    await setNotice.mutateAsync(noticeText);
    setNoticeSaved(true);
    setTimeout(() => setNoticeSaved(false), 2000);
  }

  // Admin login gate
  if (!isAuthed) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "#000000" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <div
            style={{
              background: "linear-gradient(135deg, #16E0E6, #B34BFF)",
              padding: "1px",
              borderRadius: "16px",
              boxShadow: "0 0 40px #16E0E620",
            }}
          >
            <div
              className="rounded-[15px] p-8"
              style={{ background: "rgba(11, 15, 24, 0.98)" }}
            >
              <div className="text-center mb-6">
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
                  style={{
                    background: "#B34BFF15",
                    border: "1px solid #B34BFF40",
                  }}
                >
                  <ShieldAlert size={22} style={{ color: "#B34BFF" }} />
                </div>
                <h2 className="text-lg font-bold uppercase tracking-widest text-white">
                  Admin Panel
                </h2>
                <p className="text-xs mt-1" style={{ color: "#8B95A7" }}>
                  Restricted access
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="admin-password"
                    className="block text-xs font-semibold tracking-widest uppercase mb-2"
                    style={{ color: "#A7B0C0" }}
                  >
                    Admin Password
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      setAdminError("");
                    }}
                    placeholder="Enter admin password..."
                    className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none"
                    style={{
                      background: "#060A12",
                      border: adminError
                        ? "1px solid #FF4B4B"
                        : "1px solid #1A2436",
                    }}
                    id="admin-password"
                    data-ocid="admin.input"
                  />
                  {adminError && (
                    <p
                      className="mt-2 text-xs"
                      style={{ color: "#FF4B4B" }}
                      data-ocid="admin.error_state"
                    >
                      {adminError}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={adminLoading || !adminPassword}
                  className="w-full py-3 rounded-xl font-bold tracking-widest uppercase text-sm disabled:opacity-50"
                  style={{
                    background: "linear-gradient(90deg, #16E0E6, #B34BFF)",
                    color: "#000",
                  }}
                  data-ocid="admin.submit_button"
                >
                  {adminLoading ? "Verifying..." : "ACCESS"}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => navigate({ to: "/dashboard" })}
                  className="text-xs hover:opacity-80 transition-opacity"
                  style={{ color: "#8B95A7" }}
                >
                  ← Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Admin panel
  return (
    <div className="min-h-screen" style={{ background: "#000000" }}>
      {/* Admin header */}
      <header
        className="sticky top-0 z-50 border-b px-4 sm:px-6 h-16 flex items-center justify-between"
        style={{
          background: "rgba(0,0,0,0.9)",
          backdropFilter: "blur(20px)",
          borderColor: "#B34BFF40",
          boxShadow: "0 0 20px #B34BFF15",
        }}
      >
        <div className="flex items-center gap-3">
          <ShieldAlert size={18} style={{ color: "#B34BFF" }} />
          <span
            className="font-bold uppercase tracking-widest text-sm"
            style={{
              background: "linear-gradient(90deg, #16E0E6, #B34BFF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ASHISH XP — ADMIN
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard" })}
            className="text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{ color: "#8B95A7", border: "1px solid #1A2436" }}
          >
            ← Dashboard
          </button>
          <button
            type="button"
            onClick={startAdd}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider"
            style={{
              background: "linear-gradient(90deg, #16E0E6, #B34BFF)",
              color: "#000",
            }}
            data-ocid="admin.open_modal_button"
          >
            <Plus size={14} />
            Add File
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Notice Banner Editor */}
        <section
          className="p-5 rounded-xl"
          style={{ background: "#0B0F18", border: "1px solid #1A2436" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Bell size={16} style={{ color: "#16E0E6" }} />
            <h3 className="font-bold uppercase tracking-widest text-sm text-white">
              Update Banner
            </h3>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={noticeText}
              onChange={(e) => setNoticeText(e.target.value)}
              placeholder="Set a notice for all users (leave empty to hide)..."
              className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none"
              style={{ background: "#060A12", border: "1px solid #1A2436" }}
              data-ocid="admin.notice_input"
            />
            <button
              type="button"
              onClick={handleSaveNotice}
              disabled={setNotice.isPending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all disabled:opacity-50"
              style={{
                background: noticeSaved ? "#4BFFA020" : "#16E0E615",
                color: noticeSaved ? "#4BFFA0" : "#16E0E6",
                border: `1px solid ${noticeSaved ? "#4BFFA040" : "#16E0E630"}`,
              }}
              data-ocid="admin.notice_save_button"
            >
              {setNotice.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              {noticeSaved ? "Saved!" : "Save"}
            </button>
          </div>
        </section>

        {/* Files table */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold uppercase tracking-widest text-sm text-white">
              Files ({files.length})
            </h3>
          </div>

          {filesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2
                size={28}
                className="animate-spin"
                style={{ color: "#16E0E6" }}
              />
            </div>
          ) : files.length === 0 ? (
            <div
              className="text-center py-12 rounded-xl text-sm"
              style={{
                background: "#0B0F18",
                border: "1px dashed #1A2436",
                color: "#8B95A7",
              }}
              data-ocid="admin.empty_state"
            >
              No files yet. Add one to get started.
            </div>
          ) : (
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid #1A2436" }}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr
                    style={{
                      background: "#0B0F18",
                      borderBottom: "1px solid #1A2436",
                    }}
                  >
                    {["#", "Title", "Category", "Featured", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest"
                          style={{ color: "#8B95A7" }}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {files.map((file, i) => {
                    const color = CAT_COLORS[file.category] || "#16E0E6";
                    return (
                      <tr
                        key={file.id.toString()}
                        className="border-b last:border-b-0 transition-colors"
                        style={{
                          borderColor: "#1A2436",
                          background: i % 2 === 0 ? "#060A12" : "#080C14",
                        }}
                        data-ocid={`admin.row.${i + 1}`}
                      >
                        <td className="px-4 py-3" style={{ color: "#3A4456" }}>
                          {i + 1}
                        </td>
                        <td className="px-4 py-3 font-medium text-white max-w-[200px] truncate">
                          {file.title}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: `${color}15`, color }}
                          >
                            {file.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(file)}
                            className="p-1.5 rounded-lg transition-all"
                            style={{
                              color: file.featured ? "#F59E0B" : "#3A4456",
                              background: file.featured
                                ? "#F59E0B15"
                                : "transparent",
                            }}
                            data-ocid={`admin.toggle.${i + 1}`}
                          >
                            {file.featured ? (
                              <Star size={14} fill="currentColor" />
                            ) : (
                              <StarOff size={14} />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => startEdit(file)}
                              className="p-1.5 rounded-lg transition-all hover:bg-white/5"
                              style={{ color: "#16E0E6" }}
                              data-ocid={`admin.edit_button.${i + 1}`}
                            >
                              <Edit2 size={14} />
                            </button>
                            {deleteConfirm === file.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleDelete(file.id)}
                                  className="px-2 py-1 rounded text-xs font-bold"
                                  style={{
                                    background: "#FF4B4B20",
                                    color: "#FF4B4B",
                                  }}
                                  data-ocid={`admin.confirm_button.${i + 1}`}
                                >
                                  {deleteFile.isPending ? "..." : "Yes"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirm(null)}
                                  className="px-2 py-1 rounded text-xs"
                                  style={{ color: "#8B95A7" }}
                                  data-ocid={`admin.cancel_button.${i + 1}`}
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setDeleteConfirm(file.id)}
                                className="p-1.5 rounded-lg transition-all hover:bg-white/5"
                                style={{ color: "#FF4B4B" }}
                                data-ocid={`admin.delete_button.${i + 1}`}
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Add/Edit Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
          }}
          data-ocid="admin.dialog"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg"
          >
            <div
              style={{
                background: "linear-gradient(135deg, #16E0E650, #B34BFF50)",
                padding: "1px",
                borderRadius: "16px",
              }}
            >
              <div
                className="rounded-[15px] p-6"
                style={{ background: "#0B0F18" }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold uppercase tracking-widest text-white">
                    {editingFile ? "Edit File" : "Add New File"}
                  </h3>
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="p-1.5 rounded-lg hover:bg-white/5 transition-all"
                    style={{ color: "#8B95A7" }}
                    data-ocid="admin.close_button"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormField label="Title">
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="File title..."
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-white placeholder-gray-600 outline-none text-sm"
                      style={{
                        background: "#060A12",
                        border: "1px solid #1A2436",
                      }}
                      data-ocid="admin.title_input"
                    />
                  </FormField>

                  <FormField label="Category">
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl text-white outline-none text-sm"
                      style={{
                        background: "#060A12",
                        border: "1px solid #1A2436",
                      }}
                      data-ocid="admin.select"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Thumbnail URL">
                    <input
                      type="url"
                      value={form.thumbnailUrl}
                      onChange={(e) =>
                        setForm({ ...form, thumbnailUrl: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 rounded-xl text-white placeholder-gray-600 outline-none text-sm"
                      style={{
                        background: "#060A12",
                        border: "1px solid #1A2436",
                      }}
                      data-ocid="admin.thumbnail_input"
                    />
                  </FormField>

                  <FormField label="Download URL">
                    <input
                      type="url"
                      value={form.downloadUrl}
                      onChange={(e) =>
                        setForm({ ...form, downloadUrl: e.target.value })
                      }
                      placeholder="https://..."
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-white placeholder-gray-600 outline-none text-sm"
                      style={{
                        background: "#060A12",
                        border: "1px solid #1A2436",
                      }}
                      data-ocid="admin.download_input"
                    />
                  </FormField>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="featured-check"
                      checked={form.featured}
                      onChange={(e) =>
                        setForm({ ...form, featured: e.target.checked })
                      }
                      className="w-4 h-4 rounded"
                      data-ocid="admin.checkbox"
                    />
                    <label
                      htmlFor="featured-check"
                      className="text-sm"
                      style={{ color: "#A7B0C0" }}
                    >
                      Mark as Featured
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={cancelForm}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={{
                        background: "#0B0F18",
                        color: "#8B95A7",
                        border: "1px solid #1A2436",
                      }}
                      data-ocid="admin.cancel_button"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addFile.isPending || updateFile.isPending}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider disabled:opacity-50"
                      style={{
                        background: "linear-gradient(90deg, #16E0E6, #B34BFF)",
                        color: "#000",
                      }}
                      data-ocid="admin.save_button"
                    >
                      {addFile.isPending || updateFile.isPending
                        ? "Saving..."
                        : editingFile
                          ? "Update"
                          : "Add File"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer
        className="mt-16 border-t py-6 text-center text-xs"
        style={{ borderColor: "#1A2436", color: "#3A4456" }}
      >
        © {new Date().getFullYear()}. ASHISH XP Admin Panel
      </footer>
    </div>
  );
}

function FormField({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p
        className="block text-xs font-semibold tracking-widest uppercase mb-1.5"
        style={{ color: "#A7B0C0" }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}
