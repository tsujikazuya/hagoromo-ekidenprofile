import { getTrainingMenus } from './actions';
import { TrainingClient } from './TrainingClient';
import { cookies } from 'next/headers';

export default async function TrainingPage() {
    const menusRes = await getTrainingMenus();
    const menus = menusRes.success ? menusRes.data : [];

    const cookieStore = await cookies();
    const sessionStr = cookieStore.get('auth_session')?.value;
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    const userRole = session?.role || 'player';

    return (
        <TrainingClient 
            initialMenus={menus || []} 
            userRole={userRole}
        />
    );
}
