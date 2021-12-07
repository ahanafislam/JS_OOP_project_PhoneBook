const addContactBtn = document.querySelector('.add-contact-info-btn');
const addContactForm = document.querySelector('#add-contact-form');
const saveInfoView = document.querySelector('#save-info-view');
const closeBtn = document.querySelector('.close-btn');


class PhoneBook{
    constructor(name, phone, email){
        this.name = name;
        this.phone = phone;
        this.email = email;
    }
}

class PhoneBookUI{
    static saveContactInfoUI(phoneBook){
        const displayInfoUI = document.querySelector('.display-info');
        const div = document.createElement('div');

        div.classList = 'column is-3';
        div.innerHTML = `
            <div class="card">
                <div class="card-content">
                    <div class="media-content">
                        <p class="title is-5">${phoneBook.name}</p>
                        <p class="subtitle">
                            <span>
                                <i class="fas fa-mobile-alt mx-2"></i>${phoneBook.phone}
                            </span>
                            <br>
                            <span>
                                <i class="fas fa-envelope-square mx-2"></i>${phoneBook.email}
                            </span>
                        </p>
                    </div>
                </div>
                <footer class="card-footer">
                    <a href="#" class="card-footer-item"><i class="fas fa-edit fa-gradient"></i></a>
                    <a href="#" class="card-footer-item"><i class="fas fa-trash-alt fa-gradient"></i></a>
                </footer>
            </div>
        `;

        displayInfoUI.appendChild(div);
    }
}

// Close Button Event Listener
closeBtn.addEventListener('click', (e) => {
    e.target.parentElement.parentElement.parentElement.toggleAttribute('hidden');
});

// Show or Hide addContactForm Event Listener
addContactBtn.addEventListener('click',() => {
    saveInfoView.toggleAttribute('hidden');
});

addContactForm.addEventListener('submit', () => {

});

// Save Contact Information Event Listener
addContactForm.addEventListener('submit',(e) => {
    const name = document.querySelector('#full-name').value;
    const phone = document.querySelector('#phone-number').value;
    const email = document.querySelector('#email-address').value;

    // Instantiate PhoneBook
    const phoneBook = new PhoneBook(name, phone, email);
    // Instatiate PhoneBookUI Class
    PhoneBookUI.saveContactInfoUI(phoneBook);
    console.table(phoneBook);
    // e.preventDefault();
});


