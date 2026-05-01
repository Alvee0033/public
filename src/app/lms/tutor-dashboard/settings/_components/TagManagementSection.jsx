import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tags } from "lucide-react";
import TutorTagForm from "@/components/TutorTagForm";

const TagManagementSection = ({ handleSaveTag, isSubmittingTag }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-purple-600">
          <Tags className="h-5 w-5" />
          Tag Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TutorTagForm 
          setFieldValue={() => {}} 
          values={{}} 
          errors={{}} 
          touched={{}} 
          onSave={handleSaveTag}
          isSubmitting={isSubmittingTag}
        />
      </CardContent>
    </Card>
  );
};

export default TagManagementSection;