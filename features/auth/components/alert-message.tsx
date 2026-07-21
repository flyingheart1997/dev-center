import { Alert, AlertDescription } from '@/components/ui/alert'

export const AlertMessage = ({ message }: { message: { text: string, type: 'info' | "error" | "success" } }) => {
    return (
        <Alert variant={message.type === "error" ? "destructive" : "default"} className='border-dashed'>
            <AlertDescription className='text-center'>{message.text}</AlertDescription>
        </Alert>
    )
}
