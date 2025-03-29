interface RoomCardProps {
    title: string;
    description: string;
    price: number;
    imageUrl: string;
}
// Room Showcase
export default function RoomCard({ title, description, price, imageUrl }: RoomCardProps) {
    return (
        <div className="max-w-xs rounded overflow-hidden shadow-lg">
            <img className="w-full h-48 object-cover" src={imageUrl} alt={title}/>
            <div className="px-6 py-4">
                <h3 className="font-bold text-xl mb-2">{title}</h3>
                <p className="text-gray-700 text-base">{description}</p>
            </div>
            <div className="px-6 py-4">
                <span className="text-lg font-bold">CA${price} / Night</span>
            </div>
        </div>
    );
}
