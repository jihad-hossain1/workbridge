import { FolderKanban } from "lucide-react";

export const NoProject = () => {
  return (
    <div className="text-center p-12 bg-white border border-slate-150 rounded-xl max-w-md mx-auto mt-12">
      <FolderKanban className="h-10 w-10 text-slate-400 mx-auto mb-4" />
      <h3 className="font-semibold text-slate-800 text-lg">
        Project not found
      </h3>
      <p className="text-xs text-slate-500 mt-1">
        The requested project directory could not be loaded. It may have been
        deleted.
      </p>
      <button
        onClick={() => window.history.back()}
        className="mt-4 px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg"
      >
        Back to Projects
      </button>
    </div>
  );
};
