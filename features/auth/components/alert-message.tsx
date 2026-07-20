import { Alert, AlertDescription } from '@/components/ui/alert'

export const AlertMessage = ({ message }: { message: { text: string, type: 'info' | "error" | "success" } }) => {
    return (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
            <AlertDescription>{message.text}</AlertDescription>
        </Alert>
    )
}
