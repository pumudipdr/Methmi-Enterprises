"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAuthorizedAdmin } from "@/lib/server/admin-tours";

export async function revalidateAfterVehicleChange() {
  await requireAuthorizedAdmin();
  updateTag("public-fleet");
  revalidatePath("/fleet");
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/vehicles");
}
