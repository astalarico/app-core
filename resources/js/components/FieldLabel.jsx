export default function FieldLabel({ label, Icon, SaveButton = "" }, ...props) {
    return (
        <div className="field-label flex justify-between min-w-full mb-4">
            <div className="flex items-center">
                <Icon className="mr-2" />
                <div className="font-bold">{label}</div>
            </div>
            <div>
                {SaveButton}
            </div>
        </div>
    );
}
