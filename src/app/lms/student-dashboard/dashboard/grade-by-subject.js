import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const subjects = [
  { name: "Biology", percentage: 45 },
  { name: "Chemistry", percentage: 35 },
  { name: "Geography", percentage: 55 },
  { name: "History", percentage: 65 },
  { name: "Literature", percentage: 85 },
  { name: "Art", percentage: 95 },
];

export function GradesBySubject() {
  return (
    <div className="col-span-full md:col-span-6 space-y-6 rounded-xl bg-white p-6 ">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Grade by Subject</h2>
        <div className="flex gap-2">
          <Select defaultValue="weekly">
            <SelectTrigger className="h-9 w-[100px] border-0 bg-gray-50 text-sm">
              <SelectValue placeholder="Weekly" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="grade3">
            <SelectTrigger className="h-9 w-[100px] border-0 bg-gray-50 text-sm">
              <SelectValue placeholder="Grade 3" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grade3">Grade 3</SelectItem>
              <SelectItem value="grade4">Grade 4</SelectItem>
              <SelectItem value="grade5">Grade 5</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="relative">        
        <div className="space-y-4">
          {subjects.map((subject) => (
            <div key={subject.name} className="space-y-2">
              {/* <div className="text-sm font-medium">{subject.name}</div> */}
              <div className="h-7 w-full overflow-hidden rounded-e-md bg-gray-50">
                <div
                  className="h-full rounded-e-md bg-[#E5E1FF] flex items-center pl-2 text-sm"
                  style={{ width: `${subject.percentage}%` }}
                >{subject.name}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex h-full justify-between py-[6px] text-sm text-gray-400 mt-2">
          {[...Array(11)].map((_, i) => (
            <div key={i}>{i * 10}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
