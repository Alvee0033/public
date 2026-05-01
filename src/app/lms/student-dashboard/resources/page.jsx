import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Video,
  Download,
  Search,
  BookOpen,
  Link as LinkIcon,
} from "lucide-react";

const resources = [
  {
    id: 1,
    title: "Full Stack Development Course Materials",
    type: "document",
    format: "PDF",
    size: "2.5 MB",
    course: "Full Stack Development",
    date: "2024-03-15",
  },
  {
    id: 2,
    title: "UI/UX Design Principles Handbook",
    type: "document",
    format: "PDF",
    size: "1.8 MB",
    course: "UI/UX Design Principles",
    date: "2024-03-14",
  },
  {
    id: 3,
    title: "React Components Tutorial",
    type: "video",
    duration: "45 minutes",
    course: "Full Stack Development",
    date: "2024-03-13",
  },
];

const recommendedReadings = [
  {
    id: 1,
    title: "Modern JavaScript for Beginners",
    author: "John Smith",
    link: "https://example.com/js-book",
  },
  {
    id: 2,
    title: "Design Systems Handbook",
    author: "Sarah Johnson",
    link: "https://example.com/design-book",
  },
  {
    id: 3,
    title: "Cloud Computing Essentials",
    author: "Michael Chen",
    link: "https://example.com/cloud-book",
  },
];

export default function Resources() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Resources & Notes</h1>
      </div>

      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search resources..."
          className="max-w-sm"
          type="search"
        />
        <Button>
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Course Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    {resource.type === "document" ? (
                      <FileText className="h-8 w-8 text-blue-500" />
                    ) : (
                      <Video className="h-8 w-8 text-purple-500" />
                    )}
                    <div>
                      <h3 className="font-medium">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {resource.course} • {resource.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-right">
                      {resource.type === "document" ? (
                        <p>{resource.format} • {resource.size}</p>
                      ) : (
                        <p>{resource.duration}</p>
                      )}
                    </div>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recommended Readings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommendedReadings.map((reading) => (
                <Card key={reading.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{reading.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          by {reading.author}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}