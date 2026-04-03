export function setupApp() {
    const root = document.getElementById("root")!;

    const heading = document.createElement("h1");
    heading.textContent = "Welcome to your app";
    heading.style.textAlign = "center";
    heading.style.marginTop = "4rem";

    root.appendChild(heading);
}
