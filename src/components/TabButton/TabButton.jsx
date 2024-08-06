export default function TabComponent({children, onSelect, isSelected}){

    // console.log("Tab Button Rendered");

    return(
        <li>
            <button className={isSelected ? "active" : undefined} onClick={onSelect}>{children}</button>
        </li>
    )
}