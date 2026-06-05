import { NextRequest } from "next/server";
import { ServerAuth } from "@/lib/auth/ServerAuth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await ServerAuth.serverUser();
    if (!user) return errorResponse("Unauthorized", null, 401);

    const { id } = await params;

    const attachments = await prisma.attachment.findMany({
      where: { taskId: id },
      include: {
        uploadedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(attachments);
  } catch (error) {
    return errorResponse((error as Error).message || "Internal Server Error", null, 500);
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await ServerAuth.serverUser();
    if (!user) return errorResponse("Unauthorized", null, 401);

    const { id } = await params;

    const { fileName, fileUrl, fileSize, mimeType } = await req.json();
    if (!fileName || !fileUrl) {
      return errorResponse("fileName and fileUrl are required");
    }

    const attachment = await prisma.attachment.create({
      data: {
        taskId: id,
        fileName,
        fileUrl,
        fileSize: fileSize ? parseInt(fileSize) : null,
        mimeType: mimeType || null,
        uploadedById: user.userId,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return successResponse(attachment, "Attachment uploaded and registered successfully", 201);
  } catch (error) {
    return errorResponse((error as Error).message || "Internal Server Error", null, 500);
  }
}
