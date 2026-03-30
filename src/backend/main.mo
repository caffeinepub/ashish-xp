import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";

actor {
  type FileItem = {
    id : Nat;
    title : Text;
    category : Text;
    thumbnailUrl : Text;
    downloadUrl : Text;
    featured : Bool;
  };

  module FileItem {
    public func compare(file1 : FileItem, file2 : FileItem) : Order.Order {
      Nat.compare(file1.id, file2.id);
    };
  };

  let files = Map.empty<Nat, FileItem>();
  var nextFileId = 1;
  var noticeMessage : Text = "Welcome to Ashish XP! Stay tuned for video editing resources.";
  let adminPasswordHash = "5a70cd0fc89585c17471261528c3eb6693af5ba28c1e815349fd91391d5aba48";
  let accessPasswordHash = adminPasswordHash; // same as admin

  public shared ({ caller }) func addFile(title : Text, category : Text, thumbnailUrl : Text, downloadUrl : Text) : async Nat {
    if (title == "" or category == "" or thumbnailUrl == "" or downloadUrl == "") {
      Runtime.trap("All fields are required");
    };
    let id = nextFileId;
    nextFileId += 1;

    let file : FileItem = {
      id;
      title;
      category;
      thumbnailUrl;
      downloadUrl;
      featured = false;
    };

    files.add(id, file);
    id;
  };

  public shared ({ caller }) func updateFile(id : Nat, title : Text, category : Text, thumbnailUrl : Text, downloadUrl : Text, featured : Bool) : async () {
    switch (files.get(id)) {
      case (null) {
        Runtime.trap("File not found");
      };
      case (?existingFile) {
        let updatedFile : FileItem = {
          id;
          title;
          category;
          thumbnailUrl;
          downloadUrl;
          featured;
        };
        files.add(id, updatedFile);
      };
    };
  };

  public shared ({ caller }) func deleteFile(id : Nat) : async () {
    if (not files.containsKey(id)) {
      Runtime.trap("File not found");
    };
    files.remove(id);
  };

  public shared ({ caller }) func setFeatured(id : Nat, featured : Bool) : async () {
    switch (files.get(id)) {
      case (null) {
        Runtime.trap("File not found");
      };
      case (?existingFile) {
        let updatedFile : FileItem = {
          id;
          title = existingFile.title;
          category = existingFile.category;
          thumbnailUrl = existingFile.thumbnailUrl;
          downloadUrl = existingFile.downloadUrl;
          featured;
        };
        files.add(id, updatedFile);
      };
    };
  };

  public shared ({ caller }) func setNotice(message : Text) : async () {
    noticeMessage := message;
  };

  public query ({ caller }) func getFiles() : async [FileItem] {
    files.values().toArray().sort();
  };

  public query ({ caller }) func getFilesByCategory(category : Text) : async [FileItem] {
    files.values().filter(func(file) { file.category == category }).toArray().sort();
  };

  public query ({ caller }) func getFeatured() : async [FileItem] {
    files.values().filter(func(file) { file.featured }).toArray().sort();
  };

  public query ({ caller }) func getNotice() : async Text {
    noticeMessage;
  };

  public query ({ caller }) func verifyAdminPassword(hash : Text) : async Bool {
    hash == adminPasswordHash;
  };

  public query ({ caller }) func verifyAccessPassword(hash : Text) : async Bool {
    hash == accessPasswordHash;
  };

  public shared ({ caller }) func seedData() : async () {
    files.clear();
    nextFileId := 1;
    noticeMessage := "Welcome to Ashish XP! Stay tuned for video editing resources.";

    // Editing Videos
    ignore await addFile("Cinematic LUTs", "Editing Videos", "https://placehold.co/400x225/1a1a2e/00ffff?text=Cinematic+LUTs", "https://example.com/download/cinematic-luts");
    ignore await addFile("Smooth Transitions", "Editing Videos", "https://placehold.co/400x225/1a1a2e/00ffff?text=Smooth+Transitions", "https://example.com/download/smooth-transitions");
    ignore await addFile("Color Grading Pack", "Editing Videos", "https://placehold.co/400x225/1a1a2e/00ffff?text=Color+Grading", "https://example.com/download/color-grading-pack");

    // ZIP Files
    ignore await addFile("Project Files Bundle", "ZIP Files", "https://placehold.co/400x225/1a1a2e/00ffff?text=Project+Files", "https://example.com/download/project-files-bundle");
    ignore await addFile("Template Pack", "ZIP Files", "https://placehold.co/400x225/1a1a2e/00ffff?text=Template+Pack", "https://example.com/download/template-pack");
    ignore await addFile("Sample Footage", "ZIP Files", "https://placehold.co/400x225/1a1a2e/00ffff?text=Sample+Footage", "https://example.com/download/sample-footage");

    // Presets
    ignore await addFile("VHS Presets", "Presets", "https://placehold.co/400x225/1a1a2e/00ffff?text=VHS+Presets", "https://example.com/download/vhs-presets");
    ignore await addFile("Glitch Effects", "Presets", "https://placehold.co/400x225/1a1a2e/00ffff?text=Glitch+Effects", "https://example.com/download/glitch-effects");
    ignore await addFile("Fade In Pack", "Presets", "https://placehold.co/400x225/1a1a2e/00ffff?text=Fade+In+Pack", "https://example.com/download/fade-in-pack");

    // Overlays
    ignore await addFile("Light Leaks", "Overlays", "https://placehold.co/400x225/1a1a2e/00ffff?text=Light+Leaks", "https://example.com/download/light-leaks");
    ignore await addFile("Dust & Scratches", "Overlays", "https://placehold.co/400x225/1a1a2e/00ffff?text=Dust+Scratches", "https://example.com/download/dust-scratches");
    ignore await addFile("Bokeh Overlays", "Overlays", "https://placehold.co/400x225/1a1a2e/00ffff?text=Bokeh+Overlays", "https://example.com/download/bokeh-overlays");

    await setFeatured(1, true);
    await setFeatured(4, true);
    await setFeatured(7, true);
  };
};
