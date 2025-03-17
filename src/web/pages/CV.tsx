import ActionButton from "@/components/buttons/ActionButton";
import ImportJobsModal from "@/components/modals/ImportJobsModal";
import  { useState } from "react";
const CVPage= () => {
 const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  return (
    <div>
      <h1>CV</h1>
<ActionButton
          onClick={() => setIsImportModalOpen(true)}
        >
          Import Jobs
        </ActionButton>
      <ImportJobsModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
  </div>

  );
};

export default CVPage;
