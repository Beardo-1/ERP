import React, { useEffect, useState } from "react";
import { dataService } from "../services/dataService";

interface Photo {
  id: string;
  agent_id: string;
  url: string;
  status: "pending" | "approved" | "rejected";
  uploaded_at: string;
  remarks?: string;
}

const CEO_NAME = "CEO";

const AgentPhotoManager: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    setLoading(true);
    dataService.getAgentPhotos().then((data) => {
      setPhotos(data as Photo[]);
      setLoading(false);
    });
  }, []);

  const handleApprove = async (photoId: string) => {
    await dataService.approveAgentPhoto(photoId, CEO_NAME);
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, status: "approved" } : p))
    );
    setSelectedPhoto(null);
  };

  // No rejectAgentPhoto method, so just update locally
  const handleReject = async (photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === photoId ? { ...p, status: "rejected", remarks } : p
      )
    );
    setSelectedPhoto(null);
    setRemarks("");
  };

  if (loading) return <div>Loading photos...</div>;

  return (
    <div>
      <h2>Agent Photo Review</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {photos.map((photo) => (
          <div
            key={photo.id}
            style={{
              border: "1px solid #ccc",
              padding: 12,
              borderRadius: 8,
              width: 220,
              background: photo.status === "pending" ? "#fffbe6" : "#f6ffed",
            }}
          >
            <img
              src={photo.url}
              alt="Agent"
              style={{ width: "100%", height: 120, objectFit: "cover" }}
              onClick={() => setSelectedPhoto(photo)}
            />
            <div>
              <b>Status:</b> {photo.status}
            </div>
            {photo.status === "rejected" && (
              <div>
                <b>Remarks:</b> {photo.remarks}
              </div>
            )}
            <div>
              <button
                disabled={photo.status !== "pending"}
                onClick={() => setSelectedPhoto(photo)}
                style={{ marginTop: 8 }}
              >
                Review
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedPhoto && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 12,
              minWidth: 350,
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.url}
              alt="Agent"
              style={{ width: "100%", maxHeight: 300, objectFit: "contain" }}
            />
            <div style={{ marginTop: 16 }}>
              <button
                onClick={() => handleApprove(selectedPhoto.id)}
                style={{ marginRight: 8 }}
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(selectedPhoto.id)}
                style={{ marginRight: 8 }}
              >
                Reject
              </button>
              <button onClick={() => setSelectedPhoto(null)}>Cancel</button>
            </div>
            <div style={{ marginTop: 12 }}>
              <textarea
                placeholder="Remarks (for rejection)"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentPhotoManager; 