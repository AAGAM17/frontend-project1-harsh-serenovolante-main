import { ProjectInfo as ProjectInfoType } from '@/types/chat';
import { motion } from 'framer-motion';

interface ProjectInfoProps {
  project: ProjectInfoType;
}

export const ProjectInfo: React.FC<ProjectInfoProps> = ({ project }) => {
  if (!project) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-lg p-6 mb-6"
    >
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-900">
          {project.title}
        </h2>
        <div className="space-y-1">
          {project.company && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Company:</span> {project.company}
            </p>
          )}
          {project.value && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Value:</span> ₹{project.value} Cr
            </p>
          )}
          {project.description && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Description:</span> {project.description}
            </p>
          )}
          {project.source_url && (
            <p className="text-sm text-gray-600">
              <a href={project.source_url} target="_blank" rel="noopener noreferrer" className="text-[#3575F5] hover:underline">
                Source Link →
              </a>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}; 