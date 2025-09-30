import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "value_list.txt");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const values = fileContents
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return NextResponse.json(values);
}
