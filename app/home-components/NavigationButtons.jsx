import React from "react";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

library.add(faArrowRight, faArrowLeft);

const NavigationButtons = ({
  currentStep,
  main,
  selectedPurpose,
  selectedTarget,
  selectedKeys,
  selectedPlatforms,
  selectedIntegrations,
  selectedPerformance,
  selectedSecurity,
  selectedStorage,
  selectedEnvironment,
  selectedLanguage,
  uploadedFiles,
  busy,
  handlePrev,
  handleNext,
}) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleGenerate = async () => {
    if (currentStep === 12 && session) {
      try {
        // Create project
        const projectResponse = await fetch('/api/projects/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectName: main || 'New Project'
          })
        });

        if (!projectResponse.ok) throw new Error('Failed to create project');
        const { project } = await projectResponse.json();

        // Create initial version
        const versionResponse = await fetch('/api/version/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: project._id,
            versionName: 'v1.0',
            summary: 'Initial version created from SRS generation'
          })
        });

        if (!versionResponse.ok) throw new Error('Failed to create version');
        const { version } = await versionResponse.json();

        // Upload version file with all collected data
        const formData = new FormData();
        formData.append('projectId', project._id);
        formData.append('versionId', version._id);
        
        // Compile all selections into a comprehensive description
        const projectDescription = `
Project: ${main}
Purpose: ${selectedPurpose}
Target: ${selectedTarget}
Key Features: ${selectedKeys.join(', ')}
Platforms: ${selectedPlatforms.join(', ')}
Integrations: ${selectedIntegrations.join(', ')}
Performance: ${selectedPerformance.join(', ')}
Security: ${selectedSecurity.join(', ')}
Storage: ${selectedStorage}
Environment: ${selectedEnvironment}
Languages: ${selectedLanguage.join(', ')}`;
        
        formData.append('codeSnippet', projectDescription);
        formData.append('expectedOutput', 'SRS Document Generated');
        formData.append('testCase', 'Initial project setup and requirements validation');
        
        if (uploadedFiles && uploadedFiles.length > 0) {
          formData.append('mainFile', uploadedFiles[0]);
        }

        const fileResponse = await fetch('/api/version-file/upload', {
          method: 'POST',
          body: formData
        });

        if (!fileResponse.ok) throw new Error('Failed to upload version file');

        // Redirect to projects page
        router.push('/projects');
      } catch (error) {
        console.error('Error creating project:', error);
        alert('Failed to create project. Please try again.');
      }
    } else {
      handleNext();
    }
  };

  return (
    <div className="w-full flex justify-center gap-20 items-center">
      <div className={`mt-10 ${currentStep <= 1 ? "hidden " : ""} button4`}>
        <div className={`button-layer4`}></div>
        <button
          type="submit"
          onClick={handlePrev}
          style={{ fontFamily: " 'Cinzel Variable', serif" }}
          className={` bg-black px-4 py-3 w-full text-xl  font-semibold tracking-wide flex gap-2 justify-center items-center`}
        >
          <>
            <FontAwesomeIcon icon={faArrowLeft} />
            <p>Back</p>
          </>
        </button>
      </div>
      <div className={`mt-10 button4`}>
        <div
          className={`${
            (main === "" && currentStep === 1) ||
            (selectedPurpose === "" && currentStep === 2) ||
            (selectedTarget === "" && currentStep === 3) ||
            (selectedKeys.length === 0 && currentStep === 4) ||
            (selectedPlatforms.length === 0 && currentStep === 5) ||
            (selectedIntegrations.length === 0 && currentStep === 6) ||
            (selectedPerformance.length === 0 && currentStep === 7) ||
            (selectedSecurity.length === 0 && currentStep === 8) ||
            (selectedStorage === "" && currentStep === 9) ||
            (selectedEnvironment === "" && currentStep === 10) ||
            (selectedLanguage.length === 0 && currentStep === 11) ||
            (uploadedFiles?.length === 0 && currentStep === 12) ||
            busy
              ? "pointer-events-none opacity-40"
              : ""
          } button-layer4`}
        ></div>
        <button
          type="submit"
          onClick={handleGenerate}
          style={{ fontFamily: " 'Cinzel Variable', serif" }}
          className={`${
            (main === "" && currentStep === 1) ||
            (selectedPurpose === "" && currentStep === 2) ||
            (selectedTarget === "" && currentStep === 3) ||
            (selectedKeys.length === 0 && currentStep === 4) ||
            (selectedPlatforms.length === 0 && currentStep === 5) ||
            (selectedIntegrations.length === 0 && currentStep === 6) ||
            (selectedPerformance.length === 0 && currentStep === 7) ||
            (selectedSecurity.length === 0 && currentStep === 8) ||
            (selectedStorage === "" && currentStep === 9) ||
            (selectedEnvironment === "" && currentStep === 10) ||
            (selectedLanguage.length === 0 && currentStep === 11) ||
            (uploadedFiles?.length === 0 && currentStep === 12) ||
            busy
              ? "pointer-events-none opacity-40"
              : ""
          } bg-black px-4 py-3 w-full text-xl  font-semibold tracking-wide flex flex-row-reverse gap-2 justify-center items-center`}
        >
          {busy ? (
            <>
              <Loader2 className=" h-5 w-5 animate-spin" />{" "}
              <p className="text-base">Please wait</p>{" "}
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faArrowRight} />
              <p>{currentStep === 12 ? "Generate" : "Next"}</p>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default NavigationButtons;