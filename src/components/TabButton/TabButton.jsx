export default function TabComponent({children,  isSelected, ...props}){

    // console.log("Tab Button Rendered");
    // console.log(props);f

    return(
        <li>
            <button className={isSelected ? "active" : undefined} {...props}>{children}</button>
        </li>
    )
}