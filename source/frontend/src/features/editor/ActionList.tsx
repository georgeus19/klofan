export default function ActionList() {
    return (
        <div className="flex gap-4 p-2 justify-center">
            <input type="file" id="import-input" hidden></input>
            <label htmlFor="import-input" className="p-2 rounded shadow">
                Import
            </label>
            <button className="p-2 rounded shadow">Export</button>
        </div>
    );
}
