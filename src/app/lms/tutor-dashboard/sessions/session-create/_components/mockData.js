// Mock data for autocomplete dropdowns
export const mockStudents = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com" },
  { id: 4, name: "Sarah Wilson", email: "sarah@example.com" },
]

export const mockCourses = [
  { id: 1, name: "Mathematics 101", code: "MATH101" },
  { id: 2, name: "Physics Advanced", code: "PHYS201" },
  { id: 3, name: "Chemistry Basics", code: "CHEM101" },
  { id: 4, name: "Biology Fundamentals", code: "BIO101" },
]

export const mockModules = [
  { id: 1, name: "Algebra Fundamentals", courseId: 1 },
  { id: 2, name: "Geometry Basics", courseId: 1 },
  { id: 3, name: "Mechanics", courseId: 2 },
  { id: 4, name: "Thermodynamics", courseId: 2 },
]

export const mockLessons = [
  { id: 1, name: "Linear Equations", moduleId: 1 },
  { id: 2, name: "Quadratic Functions", moduleId: 1 },
  { id: 3, name: "Triangles and Angles", moduleId: 2 },
  { id: 4, name: "Circle Properties", moduleId: 2 },
]

export const mockTutors = [
  { id: 1, name: "Dr. Smith", subject: "Mathematics" },
  { id: 2, name: "Prof. Johnson", subject: "Physics" },
  { id: 3, name: "Ms. Davis", subject: "Chemistry" },
  { id: 4, name: "Mr. Brown", subject: "Biology" },
]

export const mockMasterLessons = [
  { id: 1, name: "Advanced Calculus", subject: "Mathematics" },
  { id: 2, name: "Quantum Physics", subject: "Physics" },
  { id: 3, name: "Organic Chemistry", subject: "Chemistry" },
  { id: 4, name: "Molecular Biology", subject: "Biology" },
]

export const mockSchedules = [
  { id: 1, name: "Morning Schedule", time: "9:00 AM - 12:00 PM" },
  { id: 2, name: "Afternoon Schedule", time: "1:00 PM - 4:00 PM" },
  { id: 3, name: "Evening Schedule", time: "5:00 PM - 8:00 PM" },
]
