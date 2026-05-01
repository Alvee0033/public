import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const subjects = [
  { name: "Math", progress: 75, lastTest: 85 },
  { name: "Science", progress: 60, lastTest: 78 },
  { name: "English", progress: 90, lastTest: 92 },
  { name: "History", progress: 80, lastTest: 88 },
]

export function ProgressTracker() {
  return (
    (<div className="grid gap-4 md:grid-cols-2">
      {subjects.map((subject) => (
        <Card key={subject.name}>
          <CardHeader>
            <CardTitle>{subject.name}</CardTitle>
            <CardDescription>Overall progress and latest test score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Progress</span>
                <span>{subject.progress}%</span>
              </div>
              <Progress value={subject.progress} />
              <div className="flex items-center justify-between">
                <span>Last Test Score</span>
                <span>{subject.lastTest}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>)
  );
}

