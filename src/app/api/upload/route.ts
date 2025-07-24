import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const desktopPath = path.join("E:", "OneDrive", "Desktop", file.name);
    console.log(desktopPath);

    await writeFile(desktopPath, buffer);
    console.log("File saved to desktop!");

    return NextResponse.json({ message: "File saved to desktop!" });
}
