// Haetaan tallennetut käyttäjätiedot ja teema
var username = localStorage["username"];
var teema = localStorage["teema"] || "light";
var viestit = [];
const socket = io();

// Sivujen sisällöt
const sivut = {
    etusivu: `
    <h2>Tervetuloa Testi Yritys Oy:n sivuille!</h2>
    <p>Olemme suomalainen palvelualan yritys, joka tarjoaa asiantuntevaa ja ystävällistä palvelua yrityksille ja yksityisasiakkaille. Meille tärkeintä on asiakkaan tyytyväisyys ja laadukas lopputulos.</p>

    <div class="row mt-4">
    <div class="col-md-6">
        <h4>Mitä tarjoamme?</h4>
        <ul class="list-group">
        <li class="list-group-item">💼 Asiakaspalveluratkaisut</li>
        <li class="list-group-item">💻 IT-tuki ja tekninen neuvonta</li>
        <li class="list-group-item">📢 Markkinointi ja viestintä</li>
        <li class="list-group-item">📊 Hallinnolliset palvelut</li>
        </ul>
    </div>
    <div class="col-md-6">
        <h4>Ajankohtaista</h4>
        <p>🔔 Uusi chat-palvelumme on nyt käytössä – ota yhteyttä helposti oikeasta alakulmasta!</p>
        <p>📅 Syksyn asiakastapahtuma järjestetään marraskuussa – ilmoittaudu mukaan!</p>
    </div>
    </div>  `,

    esittely: `
    <h2>Yritysesittely</h2>

    <p>Testi Yritys Oy on suomalainen palvelualan asiantuntijayritys, joka tarjoaa laadukkaita ja asiakaslähtöisiä ratkaisuja yrityksille ja yksityishenkilöille.</p>

    <p>Olemme erikoistuneet liiketoiminnan tukipalveluihin, kuten asiakaspalveluun, IT-tukeen, markkinointiin ja hallinnollisiin tehtäviin. Yrityksemme perustettiin vuonna 2025, ja siitä lähtien olemme kasvaneet vakaasti ja laajentaneet palveluvalikoimaamme vastaamaan asiakkaidemme muuttuviin tarpeisiin.</p>

    <ul class="list-group mb-3">
        <li class="list-group-item">💼 Asiakaspalvelu ja puhelinpalvelut</li>
        <li class="list-group-item">💻 IT-tuki ja tekninen neuvonta</li>
        <li class="list-group-item">📢 Digitaalinen markkinointi ja sisällöntuotanto</li>
        <li class="list-group-item">📊 Hallinnolliset palvelut ja projektinhallinta</li>
    </ul>

    <p>Tiimimme koostuu kokeneista ammattilaisista, jotka suhtautuvat työhönsä intohimolla ja asiakasta kuunnellen. Tavoitteenamme on tehdä arjesta sujuvampaa ja liiketoiminnasta tehokkaampaa.</p>
  `,

    yhteystiedot: `
    <div class="row">
    <div class="col-md-7">
    <h2>Yhteystiedot</h2>
    <p>Osoite: Esimerkkikatu 1, 10100 Kaupunki<br>Puhelin: 012 345 6789<br>Email: info@testiyritys.fi</p>
    <div>
    <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1375564.4931309095!2d24.89376980065691!3d61.565812198126544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfi!2sfi!4v1760622365969!5m2!1sfi!2sfi" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> 
    </div>
    </div>
    <div class="col-md-5" form-yhteystiedot>
    <h2>Ota yhteyttä</h2>
    <form>
      <div class="mb-3">
        <label for="name" class="form-label">Nimi</label>
        <input type="text" class="form-control" id="name" placeholder="Etunimi Sukunimi">
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Sähköposti</label>
        <input type="email" class="form-control" id="email" placeholder="esimerkki@osoite.fi">
      </div>
      <div class="mb-3">
        <label for="phone" class="form-label">Puhelinnumero</label>
        <input type="tel" class="form-control" id="phone" placeholder="040 123 4567">
      </div>
      <div class="mb-3">
        <label for="message" class="form-label">Viesti</label>
        <textarea class="form-control" id="message" rows="4" placeholder="Kirjoita viestisi tähän..."></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Lähetä</button>
    </form>
    </div>
  </div>
    `
};

// Näyttää sivun sisällön
function naytaSivu(nimi) {
    const mainAlue = document.getElementById('main_alue');
    if (nimi === 'henkilokunta') {
        fetch('/henkilokunta')
            .then(res => res.json())
            .then(data => {
                let taulukko = `
                    <h2>Henkilökunta</h2>
                    <table class="table table-striped table-bordered">
                        <thead><tr><th>Nimi</th><th>Tehtävä</th><th>Email</th></tr></thead>
                        <tbody>
                    `;
                data.forEach(hlo => {
                    taulukko += `<tr><td>${hlo.nimi}</td><td>${hlo.tehtava}</td><td>${hlo.email}</td></tr>`;
                });
                taulukko += `</tbody></table>`; mainAlue.innerHTML = taulukko;
            });
    } else {
        mainAlue.innerHTML = sivut[nimi];
    }
}

// Vaihtaa käyttäjänimeä
function vaihdaKayttaja() {
    let userInput = prompt("Anna uusi käyttäjänimi: (Tyhja - Vierailija)", username ?? "");
    if (userInput === null) {
        return; // Käyttäjä peruutti
    }
    else if (userInput === "") {
        username = null;
        localStorage.removeItem("username");
    }
    else if (userInput.trim() !== username) {
        username = userInput.trim();
        localStorage["username"] = username;
    }
    document.getElementById('textUser').textContent = username ? username : "Vierailija";
}

// Lähettää chat-viestin
function lahetaViesti() {
    const input = document.getElementById('chatInput');
    if (!username) {
        alert("Käyttäjänimi on pakollinen viestin lähettämiseen.");
        input.value = '';
        return;
    }
    const viesti = input.value.trim();
    if (viesti) {
        const msg = username + ": " + viesti;
        // viestit.push(msg);
        socket.emit('chatMessage', msg);
        input.value = '';
    }
}

// Päivittää chat-ikkunan
function paivitaChat() {
    const chatbox = document.getElementById('chatbox');
    chatbox.innerHTML = '';
    viestit.forEach(msg => {
        const p = document.createElement('p');
        p.innerText = msg;
        chatbox.appendChild(p);
    });
}

// Vastaanottaa chat-viestin
socket.on('chatMessage', (msg) => {
    //viestit.push(msg);
    const chatbox = document.getElementById('chatbox');
    const p = document.createElement('p');
    p.textContent = msg;
    chatbox.appendChild(p);
});

// Vaihtaa teeman
function vaihdaTeema() {
    //document.body.classList.toggle('dark-mode');
    teema = (teema === "light") ? "dark" : "light";
    const htmlElement = document.documentElement;
    if (teema === "dark")
        htmlElement.setAttribute('data-bs-theme', 'dark');
    else
        htmlElement.setAttribute('data-bs-theme', 'light');
    document.getElementById('teemaNappi').textContent = (teema === "light") ? "☀️" : "🌙";
    localStorage["teema"] = teema;
    //paivitaChat();
}

// Alustaa sivun latauksen yhteydessä
window.onload = () => {
    naytaSivu('etusivu');
    if (teema === "dark") {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    }
    document.getElementById('teemaNappi').textContent = (teema === "light") ? "☀️" : "🌙";
    document.getElementById('textUser').textContent = username ?? "Vierailija";
}