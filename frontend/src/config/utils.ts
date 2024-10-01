import { grey, green, blue, red, orange } from "@ant-design/colors";
export const SKILL_LIST = [
  "NodeJS",
  "NestJS",
  "TypeScript",
  "Frontend",
  "Backend",
  "Fullstack",
  "Data Scientist",
  "DevOps",
  "Embedded",
  "Java",
  "Python",
  "C++",
  "C#",
  ".Net",
  "MySQL",
  "Docker",
];

export const LIST_LOCATION = [
  { label: "Hà Nội", value: "Hà Nội" },
  { label: "Hồ Chí Minh", value: "Hồ Chí Minh" },
  { label: "Đà Nẵng", value: "Đà Nẵng" },
  { label: "Tất cả thành phố", value: "" },
];

export function colorMethod(
  method: "POST" | "PUT" | "GET" | "DELETE" | string
) {
  switch (method) {
    case "POST":
      return green[6];
    case "PUT":
      return orange[6];
    case "GET":
      return blue[6];
    case "DELETE":
      return red[6];
    default:
      return grey[10];
  }
}
