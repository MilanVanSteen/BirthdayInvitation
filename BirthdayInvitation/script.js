function openEnvelope() {
    const envelope = document.getElementById("envelope");
    const letter = document.getElementById("letter");
    const gif = document.getElementById("gif");

    envelope.classList.add("open");

    // Small delay so letter opens first
    setTimeout(() => {
        letter.classList.add("show");
    }, 300);
}

function showRSVP() {
    document
        .getElementById("rsvpScreen")
        .classList.add("show");
}

function submitRSVP() {
    const input = document.getElementById("nameInput");
    const name = input.value.trim();

    if (!name) {
        document.getElementById("failMessage").textContent = "Je moet wel een naam invullen dumbass...";
        document.getElementById("successMessage").textContent = "";
        return;
    }

    const attendees =
        JSON.parse(localStorage.getItem("attendees")) || [];

    attendees.push(name);

    localStorage.setItem(
        "attendees",
        JSON.stringify(attendees)
    );

    document.getElementById("failMessage").textContent = "";
    document.getElementById("successMessage").textContent = "🎉 Tot dan!";
}