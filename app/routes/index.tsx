// app/routes/index.tsx
export function loader() {
    return null;
}

export default function Index() {
    return <div>
        <p>Welcome to MechHive!  Go to </p>
        <ul>
            <li>
                <a href="/shop">Shop</a>
            </li>
            <li>
                <a href="/home">Home</a>
            </li>
        </ul>
    </div>
}