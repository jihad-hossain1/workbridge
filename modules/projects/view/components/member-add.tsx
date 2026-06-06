import { Loader, Mail, UserPlus } from "lucide-react";
import fetcher from "@/services/fetch.service";
import { useForm } from "react-hook-form";
import { project_api } from "@/services/api.service";
import { useState } from "react";
import toast from "react-hot-toast";

type TAddMemberForm = {
  email: string;
  role: "ADMIN" | "PROJECT_MANAGER" | "TEAM_MEMBER";
};

interface IProps {
  projectId: string;
  refetch: () => void;
}

export const MemberAdd = (props: IProps) => {
  const { projectId, refetch } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TAddMemberForm>();

  const onAddMember = async (data: TAddMemberForm) => {
    try {
      setIsSubmitting(true);
      const res = await fetcher.post<{ success: boolean }>(
        project_api.members_post(projectId),
        data,
      );
      if (res?.success) {
        toast.success("Collaborator added to project");
        reset();
        refetch();
      }
    } catch (error) {
      toast.error((error as Error).message || "Failed to add member");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 bg-slate-50">
        <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
          <UserPlus className="h-4 w-4 text-blue-650" />
          Invite Collaborator
        </h3>
      </div>
      <form onSubmit={handleSubmit(onAddMember)} className="p-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="email"
              placeholder="collaborator@example.com"
              {...register("email", { required: "Email is required" })}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-550"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-[10px] mt-1">
              ⚠ {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Project Role *
          </label>
          <select
            {...register("role", { required: "Role is required" })}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-550 bg-white"
          >
            <option value="TEAM_MEMBER">Team Member (Add & edit tasks)</option>
            <option value="PROJECT_MANAGER">
              Project Manager (Manage tasks & members)
            </option>
            <option value="ADMIN">
              Project Admin (Full directory authority)
            </option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5"
          >
            {isSubmitting && <Loader className="h-3 w-3 animate-spin" />}
            Add Member
          </button>
        </div>
      </form>
    </div>
  );
};
