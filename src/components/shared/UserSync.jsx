import { syncUser } from "@/lib/actions/user.actions";
export default async function UserSync() {
    await syncUser();
    return null;
}