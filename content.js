const API_KEY = "";
const BASE_URL = "https://api.themoviedb.org/3/search/person?api_key=";

console.log("Content script loaded");

// Função para buscar a foto do ator
async function fetchActorPhoto(actorName) {
  const response = await fetch(`${BASE_URL}${API_KEY}&query=${actorName}`);
  const data = await response.json();
  if (data.results && data.results.length > 0) {
    return `https://image.tmdb.org/t/p/w200${data.results[0].profile_path}`;
  }
  return null;
}

// Função para destacar atores
function highlightActors() {
  console.log("Highlight function called");

  if (typeof atores === "undefined") {
    console.error("atores is not defined");
    return;
  }

  document.querySelectorAll("p").forEach((paragraph) => {
    let text = paragraph.innerHTML;

    for (const letter in atores) {
      atores[letter].forEach((actor) => {
        const regex = new RegExp(`\\b${actor}\\b`, "g");
        text = text.replace(
          regex,
          `<span class="highlight" data-actor="${actor}">${actor}</span>`
        );
      });
    }

    paragraph.innerHTML = text;
  });

  // Adiciona eventos de mouseover e mouseout para mostrar/esconder a foto
  document.querySelectorAll(".highlight").forEach((element) => {
    element.addEventListener("mouseover", async (event) => {
      const actorName = event.target.getAttribute("data-actor");
      const imgUrl = await fetchActorPhoto(actorName);
      if (imgUrl) {
        const tooltip = document.createElement("div");
        tooltip.className = "actor-tooltip";
        tooltip.style.position = "absolute";
        tooltip.style.top = `${event.pageY + 10}px`;
        tooltip.style.left = `${event.pageX + 10}px`;
        tooltip.innerHTML = `<img src="${imgUrl}" alt="${actorName}" style="width:100px;height:150px;">`;
        document.body.appendChild(tooltip);

        event.target.addEventListener("mouseout", () => {
          if (document.body.contains(tooltip)) {
            document.body.removeChild(tooltip);
          }
        });
      }
    });
  });
}

const style = document.createElement("style");
style.innerHTML = `
    .highlight {
        background-color: #FFC20E;
        cursor: pointer;
    }
    .actor-tooltip {
        background-color: #FFC20E;
        border: 1px solid #ccc;
        padding: 5px;
        z-index: 1000;
    }
`;
document.head.appendChild(style);

highlightActors();
