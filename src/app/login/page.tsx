
import { login, signup } from '../auth/actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
    return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>ログイン</CardTitle>
                    <CardDescription>
                        メールアドレスとパスワードを入力してください
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <div className="flex flex-col gap-2 pt-4">
                            <Button formAction={login}>ログイン</Button>
                            <Button variant="outline" formAction={signup}>新規登録</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
