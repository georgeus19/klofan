export function ErrorMessage({ error }: { error: string | null }) {
    return <>{error && <div className='bg-rose-200 p-2 border rounded border-rose-700 text-rose-700'>{error}</div>}</>;
}
