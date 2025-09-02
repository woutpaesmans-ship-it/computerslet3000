import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'nl' | 'en' | 'fr' | 'es' | 'it' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  nl: {
    // Header
    'header.title': '🤖 Computerslet 3000',
    'header.support': 'Steun ons',
    'header.export': 'Exporteer',
    'header.import': 'Importeer',
    'header.logout': 'Uitloggen',
    'header.language': 'Taal',
    
    // Languages
    'language.nl': 'Nederlands',
    'language.en': 'Engels',
    'language.fr': 'Frans',
    'language.es': 'Spaans',
    'language.it': 'Italiaans',
    'language.de': 'Duits',
    
    // Auth
    'auth.title': 'Welkom bij Computerslet 3000',
    'auth.subtitle': 'Maak en beheer je informatietegels',
    'auth.login': 'Inloggen',
    'auth.signup': 'Registreren',
    'auth.email': 'E-mail',
    'auth.password': 'Wachtwoord',
    'auth.loginButton': 'Inloggen',
    'auth.signupButton': 'Account aanmaken',
    'auth.loginSuccess': 'Welkom terug!',
    'auth.loginSuccessDesc': 'Je bent succesvol ingelogd.',
    'auth.signupSuccess': 'Account aangemaakt!',
    'auth.signupSuccessDesc': 'Controleer je e-mail voor bevestiging.',
    'auth.loginError': 'Fout bij inloggen',
    'auth.signupError': 'Fout bij registreren',
    
    // Dashboard
    'dashboard.loading': 'Laden...',
    'dashboard.addTile': 'Nieuwe tegel toevoegen',
    'dashboard.editTile': 'Tegel bewerken',
    'dashboard.exampleTitle': 'Voorbeeld Tegel',
    'dashboard.exampleContent': 'Dit is een voorbeeldtegel. Klik om te bewerken!',
    'dashboard.instruction': 'Klik op een tegel om de tekst te kopiëren. Gebruik ✏️ om te bewerken of 🗑️ om te verwijderen.',
    
    // Tile form
    'tile.title': 'Titel',
    'tile.content': 'Inhoud',
    'tile.color': 'Kleur',
    'tile.save': 'Opslaan',
    'tile.cancel': 'Annuleren',
    'tile.delete': 'Verwijderen',
    'tile.created': 'Tegel aangemaakt',
    'tile.updated': 'Tegel bijgewerkt',
    'tile.deleted': 'Tegel verwijderd',
    'tile.subject': 'Onderwerp:',
    'tile.text': 'Tekst:',
    'tile.editTitle': '✏️ Tegel bewerken',
    'tile.addTitle': '➕ Nieuwe tegel toevoegen',
    'tile.saveButton': '💾 Bewaar',
    'tile.saving': 'Bezig...',
    
    // Donation page
    'donation.title': 'Steun Computerslet 3000',
    'donation.description': 'Maakt de Computerslet 3000 jou ook zo gelukkig? Overweeg dan om je Computerpimp een fooi te geven. Zo kan hij ervoor zorgen dat je Computerslet 3000 haar werk zal blijven doen.',
    'donation.amount': 'Donatiebedrag',
    'donation.custom': 'Aangepast bedrag',
    'donation.donate': 'Doneren',
    'donation.processing': 'Bezig met verwerken...',
    'donation.copied': 'Gekopieerd!',
    'donation.copySuccess': 'Rekeningnummer is gekopieerd naar klembord',
    'donation.copyError': 'Kon rekeningnummer niet kopiëren',
    'donation.bankTransfer': 'Bankovermaking (gratis)',
    'donation.bankDesc': 'Maak een overmaking naar onze Belgische KBC-rekening',
    'donation.accountNumber': 'Rekeningnummer:',
    'donation.reference': 'Vermeld bij de mededeling: "Donatie Computerslet 3000"',
    'donation.onlinePayment': 'Online betaling (Stripe)',
    'donation.onlineDesc': 'Betaal veilig met creditcard, bancontact of andere betaalmethoden',
    'donation.invalidAmount': 'Ongeldig bedrag',
    'donation.minAmount': 'Voer een geldig bedrag in (minimaal €1)',
    'donation.stripeNotice': '* Online betalingen worden verwerkt door Stripe. Er kunnen transactiekosten van toepassing zijn.',
    'donation.thankYou': 'Dank je wel voor je steun! ❤️',
    'donation.helpText': 'Jouw bijdrage helpt ons om Computerslet 3000 nog beter te maken.',
    'donation.processError': 'Er is een fout opgetreden bij het verwerken van de donatie',
    
    // Donation success
    'donationSuccess.title': 'Bedankt voor je donatie!',
    'donationSuccess.description': 'Je betaling is succesvol verwerkt. We waarderen je steun enorm!',
    'donationSuccess.helpText': 'Je bijdrage helpt ons om Computerslet 3000 te blijven ontwikkelen en verbeteren.',
    'donationSuccess.backButton': 'Terug naar Computerslet 3000',
    'donationSuccess.autoRedirect': 'Je wordt automatisch doorgestuurd over 10 seconden...',
    
    // Common
    'common.home': 'Home',
    'common.error': 'Er is een fout opgetreden',
    'common.success': 'Succesvol',
    
    // Export/Import
    'export.success': '📤 Export voltooid',
    'export.successDesc': 'Je tegels zijn geëxporteerd naar een JSON-bestand.',
    'import.success': '📥 Import voltooid',
    'import.successDesc': 'tegels geïmporteerd.',
    'import.error': 'Fout bij importeren',
    'import.errorDesc': 'Het bestand kon niet worden gelezen. Controleer het formaat.',
    
    // Logout
    'logout.success': 'Tot ziens!',
    'logout.successDesc': 'Je bent succesvol uitgelogd.',
    'logout.error': 'Fout bij uitloggen',
    
    // 404
    'notFound.title': '404',
    'notFound.description': 'Oops! Pagina niet gevonden',
    'notFound.backLink': 'Terug naar Home',
  },
  en: {
    // Header
    'header.title': '🤖 Computerslet 3000',
    'header.support': 'Support us',
    'header.export': 'Export',
    'header.import': 'Import',
    'header.logout': 'Logout',
    'header.language': 'Language',
    
    // Languages
    'language.nl': 'Dutch',
    'language.en': 'English',
    'language.fr': 'French',
    'language.es': 'Spanish',
    'language.it': 'Italian',
    'language.de': 'German',
    
    // Auth
    'auth.title': 'Welcome to Computerslet 3000',
    'auth.subtitle': 'Create and manage your information tiles',
    'auth.login': 'Login',
    'auth.signup': 'Sign up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.loginButton': 'Login',
    'auth.signupButton': 'Create account',
    'auth.loginSuccess': 'Welcome back!',
    'auth.loginSuccessDesc': 'You have been successfully logged in.',
    'auth.signupSuccess': 'Account created!',
    'auth.signupSuccessDesc': 'Check your email for confirmation.',
    'auth.loginError': 'Login error',
    'auth.signupError': 'Registration error',
    
    // Dashboard
    'dashboard.loading': 'Loading...',
    'dashboard.addTile': 'Add new tile',
    'dashboard.editTile': 'Edit tile',
    'dashboard.exampleTitle': 'Example Tile',
    'dashboard.exampleContent': 'This is an example tile. Click to edit!',
    'dashboard.instruction': 'Click on a tile to copy the text. Use ✏️ to edit or 🗑️ to delete.',
    
    // Tile form
    'tile.title': 'Title',
    'tile.content': 'Content',
    'tile.color': 'Color',
    'tile.save': 'Save',
    'tile.cancel': 'Cancel',
    'tile.delete': 'Delete',
    'tile.created': 'Tile created',
    'tile.updated': 'Tile updated',
    'tile.deleted': 'Tile deleted',
    'tile.subject': 'Subject:',
    'tile.text': 'Text:',
    'tile.editTitle': '✏️ Edit tile',
    'tile.addTitle': '➕ Add new tile',
    'tile.saveButton': '💾 Save',
    'tile.saving': 'Saving...',
    
    // Donation page
    'donation.title': 'Support Computerslet 3000',
    'donation.description': 'Does Computerslet 3000 make you happy too? Consider giving your Computer pimp a tip. This way he can ensure that your Computerslet 3000 will continue to do her work.',
    'donation.amount': 'Donation amount',
    'donation.custom': 'Custom amount',
    'donation.donate': 'Donate',
    'donation.processing': 'Processing...',
    'donation.copied': 'Copied!',
    'donation.copySuccess': 'Account number copied to clipboard',
    'donation.copyError': 'Could not copy account number',
    'donation.bankTransfer': 'Bank transfer (free)',
    'donation.bankDesc': 'Transfer to our Belgian KBC account',
    'donation.accountNumber': 'Account number:',
    'donation.reference': 'Mention in communication: "Donation Computerslet 3000"',
    'donation.onlinePayment': 'Online payment (Stripe)',
    'donation.onlineDesc': 'Pay safely with credit card, bancontact or other payment methods',
    'donation.invalidAmount': 'Invalid amount',
    'donation.minAmount': 'Enter a valid amount (minimum €1)',
    'donation.stripeNotice': '* Online payments are processed by Stripe. Transaction fees may apply.',
    'donation.thankYou': 'Thank you for your support! ❤️',
    'donation.helpText': 'Your contribution helps us make Computerslet 3000 even better.',
    'donation.processError': 'An error occurred while processing the donation',
    
    // Donation success
    'donationSuccess.title': 'Thank you for your donation!',
    'donationSuccess.description': 'Your payment has been successfully processed. We greatly appreciate your support!',
    'donationSuccess.helpText': 'Your contribution helps us continue to develop and improve Computerslet 3000.',
    'donationSuccess.backButton': 'Back to Computerslet 3000',
    'donationSuccess.autoRedirect': 'You will be automatically redirected in 10 seconds...',
    
    // Common
    'common.home': 'Home',
    'common.error': 'An error occurred',
    'common.success': 'Success',
    
    // Export/Import
    'export.success': '📤 Export completed',
    'export.successDesc': 'Your tiles have been exported to a JSON file.',
    'import.success': '📥 Import completed',
    'import.successDesc': 'tiles imported.',
    'import.error': 'Import error',
    'import.errorDesc': 'The file could not be read. Check the format.',
    
    // Logout
    'logout.success': 'Goodbye!',
    'logout.successDesc': 'You have been successfully logged out.',
    'logout.error': 'Logout error',
    
    // 404
    'notFound.title': '404',
    'notFound.description': 'Oops! Page not found',
    'notFound.backLink': 'Return to Home',
  },
  fr: {
    // Header
    'header.title': '🤖 Computerslet 3000',
    'header.support': 'Soutenez-nous',
    'header.export': 'Exporter',
    'header.import': 'Importer',
    'header.logout': 'Déconnexion',
    'header.language': 'Langue',
    
    // Languages
    'language.nl': 'Néerlandais',
    'language.en': 'Anglais',
    'language.fr': 'Français',
    'language.es': 'Espagnol',
    'language.it': 'Italien',
    'language.de': 'Allemand',
    
    // Auth
    'auth.title': 'Bienvenue sur Computerslet 3000',
    'auth.subtitle': 'Créez et gérez vos tuiles d\'information',
    'auth.login': 'Connexion',
    'auth.signup': 'Inscription',
    'auth.email': 'E-mail',
    'auth.password': 'Mot de passe',
    'auth.loginButton': 'Se connecter',
    'auth.signupButton': 'Créer un compte',
    'auth.loginSuccess': 'Bon retour !',
    'auth.loginSuccessDesc': 'Vous êtes connecté avec succès.',
    'auth.signupSuccess': 'Compte créé !',
    'auth.signupSuccessDesc': 'Vérifiez votre e-mail pour confirmation.',
    'auth.loginError': 'Erreur de connexion',
    'auth.signupError': 'Erreur d\'inscription',
    
    // Dashboard
    'dashboard.loading': 'Chargement...',
    'dashboard.addTile': 'Ajouter une nouvelle tuile',
    'dashboard.editTile': 'Modifier la tuile',
    'dashboard.exampleTitle': 'Tuile d\'exemple',
    'dashboard.exampleContent': 'Ceci est une tuile d\'exemple. Cliquez pour modifier !',
    'dashboard.instruction': 'Cliquez sur une tuile pour copier le texte. Utilisez ✏️ pour modifier ou 🗑️ pour supprimer.',
    
    // Tile form
    'tile.title': 'Titre',
    'tile.content': 'Contenu',
    'tile.color': 'Couleur',
    'tile.save': 'Enregistrer',
    'tile.cancel': 'Annuler',
    'tile.delete': 'Supprimer',
    'tile.created': 'Tuile créée',
    'tile.updated': 'Tuile mise à jour',
    'tile.deleted': 'Tuile supprimée',
    'tile.subject': 'Sujet:',
    'tile.text': 'Texte:',
    'tile.editTitle': '✏️ Modifier la tuile',
    'tile.addTitle': '➕ Ajouter une nouvelle tuile',
    'tile.saveButton': '💾 Enregistrer',
    'tile.saving': 'Enregistrement...',
    
    // Donation page
    'donation.title': 'Soutenez Computerslet 3000',
    'donation.description': 'Computerslet 3000 vous rend-il heureux aussi ? Pensez à donner un pourboire à votre Pimp informatique. Ainsi, il peut s\'assurer que votre Computerslet 3000 continuera à faire son travail.',
    'donation.amount': 'Montant du don',
    'donation.custom': 'Montant personnalisé',
    'donation.donate': 'Faire un don',
    'donation.processing': 'Traitement en cours...',
    'donation.copied': 'Copié !',
    'donation.copySuccess': 'Numéro de compte copié dans le presse-papiers',
    'donation.copyError': 'Impossible de copier le numéro de compte',
    'donation.bankTransfer': 'Virement bancaire (gratuit)',
    'donation.bankDesc': 'Effectuer un virement vers notre compte KBC belge',
    'donation.accountNumber': 'Numéro de compte :',
    'donation.reference': 'Mentionner dans la communication : "Don Computerslet 3000"',
    'donation.onlinePayment': 'Paiement en ligne (Stripe)',
    'donation.onlineDesc': 'Payez en toute sécurité avec une carte de crédit, bancontact ou d\'autres méthodes de paiement',
    'donation.invalidAmount': 'Montant invalide',
    'donation.minAmount': 'Entrez un montant valide (minimum 1€)',
    'donation.stripeNotice': '* Les paiements en ligne sont traités par Stripe. Des frais de transaction peuvent s\'appliquer.',
    'donation.thankYou': 'Merci pour votre soutien ! ❤️',
    'donation.helpText': 'Votre contribution nous aide à améliorer Computerslet 3000.',
    'donation.processError': 'Une erreur s\'est produite lors du traitement du don',
    
    // Donation success
    'donationSuccess.title': 'Merci pour votre don !',
    'donationSuccess.description': 'Votre paiement a été traité avec succès. Nous apprécions énormément votre soutien !',
    'donationSuccess.helpText': 'Votre contribution nous aide à continuer de développer et d\'améliorer Computerslet 3000.',
    'donationSuccess.backButton': 'Retour à Computerslet 3000',
    'donationSuccess.autoRedirect': 'Vous serez automatiquement redirigé dans 10 secondes...',
    
    // Common
    'common.home': 'Accueil',
    'common.error': 'Une erreur s\'est produite',
    'common.success': 'Succès',
    
    // Export/Import
    'export.success': '📤 Export terminé',
    'export.successDesc': 'Vos tuiles ont été exportées vers un fichier JSON.',
    'import.success': '📥 Import terminé',
    'import.successDesc': 'tuiles importées.',
    'import.error': 'Erreur d\'importation',
    'import.errorDesc': 'Le fichier n\'a pas pu être lu. Vérifiez le format.',
    
    // Logout
    'logout.success': 'Au revoir !',
    'logout.successDesc': 'Vous avez été déconnecté avec succès.',
    'logout.error': 'Erreur de déconnexion',
    
    // 404
    'notFound.title': '404',
    'notFound.description': 'Oops ! Page non trouvée',
    'notFound.backLink': 'Retour à l\'accueil',
  },
  es: {
    // Header
    'header.title': '🤖 Computerslet 3000',
    'header.support': 'Apóyanos',
    'header.export': 'Exportar',
    'header.import': 'Importar',
    'header.logout': 'Cerrar sesión',
    'header.language': 'Idioma',
    
    // Languages
    'language.nl': 'Holandés',
    'language.en': 'Inglés',
    'language.fr': 'Francés',
    'language.es': 'Español',
    'language.it': 'Italiano',
    'language.de': 'Alemán',
    
    // Auth
    'auth.title': 'Bienvenido a Computerslet 3000',
    'auth.subtitle': 'Crea y gestiona tus fichas de información',
    'auth.login': 'Iniciar sesión',
    'auth.signup': 'Registrarse',
    'auth.email': 'Correo electrónico',
    'auth.password': 'Contraseña',
    'auth.loginButton': 'Iniciar sesión',
    'auth.signupButton': 'Crear cuenta',
    'auth.loginSuccess': '¡Bienvenido de nuevo!',
    'auth.loginSuccessDesc': 'Has iniciado sesión correctamente.',
    'auth.signupSuccess': '¡Cuenta creada!',
    'auth.signupSuccessDesc': 'Revisa tu correo para confirmación.',
    'auth.loginError': 'Error de inicio de sesión',
    'auth.signupError': 'Error de registro',
    
    // Dashboard
    'dashboard.loading': 'Cargando...',
    'dashboard.addTile': 'Agregar nueva ficha',
    'dashboard.editTile': 'Editar ficha',
    'dashboard.exampleTitle': 'Ficha de ejemplo',
    'dashboard.exampleContent': 'Esta es una ficha de ejemplo. ¡Haz clic para editar!',
    'dashboard.instruction': 'Haz clic en una ficha para copiar el texto. Usa ✏️ para editar o 🗑️ para eliminar.',
    
    // Tile form
    'tile.title': 'Título',
    'tile.content': 'Contenido',
    'tile.color': 'Color',
    'tile.save': 'Guardar',
    'tile.cancel': 'Cancelar',
    'tile.delete': 'Eliminar',
    'tile.created': 'Ficha creada',
    'tile.updated': 'Ficha actualizada',
    'tile.deleted': 'Ficha eliminada',
    'tile.subject': 'Asunto:',
    'tile.text': 'Texto:',
    'tile.editTitle': '✏️ Editar ficha',
    'tile.addTitle': '➕ Agregar nueva ficha',
    'tile.saveButton': '💾 Guardar',
    'tile.saving': 'Guardando...',
    
    // Donation page
    'donation.title': 'Apoya Computerslet 3000',
    'donation.description': '¿Computerslet 3000 también te hace feliz? Considera darle una propina a tu Proxeneta informático. Así puede asegurar que tu Computerslet 3000 siga haciendo su trabajo.',
    'donation.amount': 'Cantidad de donación',
    'donation.custom': 'Cantidad personalizada',
    'donation.donate': 'Donar',
    'donation.processing': 'Procesando...',
    'donation.copied': '¡Copiado!',
    'donation.copySuccess': 'Número de cuenta copiado al portapapeles',
    'donation.copyError': 'No se pudo copiar el número de cuenta',
    'donation.bankTransfer': 'Transferencia bancaria (gratis)',
    'donation.bankDesc': 'Transferir a nuestra cuenta KBC belga',
    'donation.accountNumber': 'Número de cuenta:',
    'donation.reference': 'Mencionar en comunicación: "Donación Computerslet 3000"',
    'donation.onlinePayment': 'Pago en línea (Stripe)',
    'donation.onlineDesc': 'Paga de forma segura con tarjeta de crédito, bancontact u otros métodos de pago',
    'donation.invalidAmount': 'Cantidad inválida',
    'donation.minAmount': 'Ingresa una cantidad válida (mínimo €1)',
    'donation.stripeNotice': '* Los pagos en línea son procesados por Stripe. Pueden aplicarse tarifas de transacción.',
    'donation.thankYou': '¡Gracias por tu apoyo! ❤️',
    'donation.helpText': 'Tu contribución nos ayuda a mejorar Computerslet 3000.',
    'donation.processError': 'Ocurrió un error al procesar la donación',
    
    // Donation success
    'donationSuccess.title': '¡Gracias por tu donación!',
    'donationSuccess.description': 'Tu pago se ha procesado correctamente. ¡Apreciamos enormemente tu apoyo!',
    'donationSuccess.helpText': 'Tu contribución nos ayuda a seguir desarrollando y mejorando Computerslet 3000.',
    'donationSuccess.backButton': 'Volver a Computerslet 3000',
    'donationSuccess.autoRedirect': 'Serás redirigido automáticamente en 10 segundos...',
    
    // Common
    'common.home': 'Inicio',
    'common.error': 'Ha ocurrido un error',
    'common.success': 'Éxito',
    
    // Export/Import
    'export.success': '📤 Exportación completada',
    'export.successDesc': 'Tus fichas han sido exportadas a un archivo JSON.',
    'import.success': '📥 Importación completada',
    'import.successDesc': 'fichas importadas.',
    'import.error': 'Error de importación',
    'import.errorDesc': 'No se pudo leer el archivo. Verifica el formato.',
    
    // Logout
    'logout.success': '¡Adiós!',
    'logout.successDesc': 'Has cerrado sesión correctamente.',
    'logout.error': 'Error al cerrar sesión',
    
    // 404
    'notFound.title': '404',
    'notFound.description': '¡Oops! Página no encontrada',
    'notFound.backLink': 'Volver al inicio',
  },
  it: {
    // Header
    'header.title': '🤖 Computerslet 3000',
    'header.support': 'Sostienici',
    'header.export': 'Esporta',
    'header.import': 'Importa',
    'header.logout': 'Disconnetti',
    'header.language': 'Lingua',
    
    // Languages
    'language.nl': 'Olandese',
    'language.en': 'Inglese',
    'language.fr': 'Francese',
    'language.es': 'Spagnolo',
    'language.it': 'Italiano',
    'language.de': 'Tedesco',
    
    // Auth
    'auth.title': 'Benvenuto in Computerslet 3000',
    'auth.subtitle': 'Crea e gestisci le tue tessere informative',
    'auth.login': 'Accedi',
    'auth.signup': 'Registrati',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.loginButton': 'Accedi',
    'auth.signupButton': 'Crea account',
    'auth.loginSuccess': 'Bentornato!',
    'auth.loginSuccessDesc': 'Hai effettuato l\'accesso con successo.',
    'auth.signupSuccess': 'Account creato!',
    'auth.signupSuccessDesc': 'Controlla la tua email per la conferma.',
    'auth.loginError': 'Errore di accesso',
    'auth.signupError': 'Errore di registrazione',
    
    // Dashboard
    'dashboard.loading': 'Caricamento...',
    'dashboard.addTile': 'Aggiungi nuova tessera',
    'dashboard.editTile': 'Modifica tessera',
    'dashboard.exampleTitle': 'Tessera di esempio',
    'dashboard.exampleContent': 'Questa è una tessera di esempio. Clicca per modificare!',
    'dashboard.instruction': 'Clicca su una tessera per copiare il testo. Usa ✏️ per modificare o 🗑️ per eliminare.',
    
    // Tile form
    'tile.title': 'Titolo',
    'tile.content': 'Contenuto',
    'tile.color': 'Colore',
    'tile.save': 'Salva',
    'tile.cancel': 'Annulla',
    'tile.delete': 'Elimina',
    'tile.created': 'Tessera creata',
    'tile.updated': 'Tessera aggiornata',
    'tile.deleted': 'Tessera eliminata',
    'tile.subject': 'Argomento:',
    'tile.text': 'Testo:',
    'tile.editTitle': '✏️ Modifica tessera',
    'tile.addTitle': '➕ Aggiungi nuova tessera',
    'tile.saveButton': '💾 Salva',
    'tile.saving': 'Salvataggio...',
    
    // Donation page
    'donation.title': 'Sostieni Computerslet 3000',
    'donation.description': 'Computerslet 3000 ti rende felice anche tu? Considera di dare una mancia al tuo Magnaccia informatico. Così può assicurarsi che il tuo Computerslet 3000 continui a fare il suo lavoro.',
    'donation.amount': 'Importo donazione',
    'donation.custom': 'Importo personalizzato',
    'donation.donate': 'Dona',
    'donation.processing': 'Elaborazione...',
    'donation.copied': 'Copiato!',
    'donation.copySuccess': 'Numero di conto copiato negli appunti',
    'donation.copyError': 'Impossibile copiare il numero di conto',
    'donation.bankTransfer': 'Bonifico bancario (gratuito)',
    'donation.bankDesc': 'Trasferisci al nostro conto KBC belga',
    'donation.accountNumber': 'Numero di conto:',
    'donation.reference': 'Menzionare nella comunicazione: "Donazione Computerslet 3000"',
    'donation.onlinePayment': 'Pagamento online (Stripe)',
    'donation.onlineDesc': 'Paga in sicurezza con carta di credito, bancontact o altri metodi di pagamento',
    'donation.invalidAmount': 'Importo non valido',
    'donation.minAmount': 'Inserisci un importo valido (minimo €1)',
    'donation.stripeNotice': '* I pagamenti online sono elaborati da Stripe. Potrebbero applicarsi commissioni di transazione.',
    'donation.thankYou': 'Grazie per il tuo supporto! ❤️',
    'donation.helpText': 'Il tuo contributo ci aiuta a migliorare Computerslet 3000.',
    'donation.processError': 'Si è verificato un errore durante l\'elaborazione della donazione',
    
    // Donation success
    'donationSuccess.title': 'Grazie per la tua donazione!',
    'donationSuccess.description': 'Il tuo pagamento è stato elaborato con successo. Apprezziamo enormemente il tuo supporto!',
    'donationSuccess.helpText': 'Il tuo contributo ci aiuta a continuare a sviluppare e migliorare Computerslet 3000.',
    'donationSuccess.backButton': 'Torna a Computerslet 3000',
    'donationSuccess.autoRedirect': 'Sarai reindirizzato automaticamente tra 10 secondi...',
    
    // Common
    'common.home': 'Home',
    'common.error': 'Si è verificato un errore',
    'common.success': 'Successo',
    
    // Export/Import
    'export.success': '📤 Esportazione completata',
    'export.successDesc': 'Le tue tessere sono state esportate in un file JSON.',
    'import.success': '📥 Importazione completata',
    'import.successDesc': 'tessere importate.',
    'import.error': 'Errore di importazione',
    'import.errorDesc': 'Non è stato possibile leggere il file. Controlla il formato.',
    
    // Logout
    'logout.success': 'Arrivederci!',
    'logout.successDesc': 'Ti sei disconnesso con successo.',
    'logout.error': 'Errore di disconnessione',
    
    // 404
    'notFound.title': '404',
    'notFound.description': 'Oops! Pagina non trovata',
    'notFound.backLink': 'Torna alla home',
  },
  de: {
    // Header
    'header.title': '🤖 Computerslet 3000',
    'header.support': 'Unterstütze uns',
    'header.export': 'Exportieren',
    'header.import': 'Importieren',
    'header.logout': 'Abmelden',
    'header.language': 'Sprache',
    
    // Languages
    'language.nl': 'Niederländisch',
    'language.en': 'Englisch',
    'language.fr': 'Französisch',
    'language.es': 'Spanisch',
    'language.it': 'Italienisch',
    'language.de': 'Deutsch',
    
    // Auth
    'auth.title': 'Willkommen bei Computerslet 3000',
    'auth.subtitle': 'Erstelle und verwalte deine Informationskacheln',
    'auth.login': 'Anmelden',
    'auth.signup': 'Registrieren',
    'auth.email': 'E-Mail',
    'auth.password': 'Passwort',
    'auth.loginButton': 'Anmelden',
    'auth.signupButton': 'Konto erstellen',
    'auth.loginSuccess': 'Willkommen zurück!',
    'auth.loginSuccessDesc': 'Du hast dich erfolgreich angemeldet.',
    'auth.signupSuccess': 'Konto erstellt!',
    'auth.signupSuccessDesc': 'Überprüfe deine E-Mail zur Bestätigung.',
    'auth.loginError': 'Anmeldefehler',
    'auth.signupError': 'Registrierungsfehler',
    
    // Dashboard
    'dashboard.loading': 'Lädt...',
    'dashboard.addTile': 'Neue Kachel hinzufügen',
    'dashboard.editTile': 'Kachel bearbeiten',
    'dashboard.exampleTitle': 'Beispielkachel',
    'dashboard.exampleContent': 'Dies ist eine Beispielkachel. Klicke zum Bearbeiten!',
    'dashboard.instruction': 'Klicke auf eine Kachel, um den Text zu kopieren. Verwende ✏️ zum Bearbeiten oder 🗑️ zum Löschen.',
    
    // Tile form
    'tile.title': 'Titel',
    'tile.content': 'Inhalt',
    'tile.color': 'Farbe',
    'tile.save': 'Speichern',
    'tile.cancel': 'Abbrechen',
    'tile.delete': 'Löschen',
    'tile.created': 'Kachel erstellt',
    'tile.updated': 'Kachel aktualisiert',
    'tile.deleted': 'Kachel gelöscht',
    'tile.subject': 'Betreff:',
    'tile.text': 'Text:',
    'tile.editTitle': '✏️ Kachel bearbeiten',
    'tile.addTitle': '➕ Neue Kachel hinzufügen',
    'tile.saveButton': '💾 Speichern',
    'tile.saving': 'Speichern...',
    
    // Donation page
    'donation.title': 'Unterstütze Computerslet 3000',
    'donation.description': 'Macht dich Computerslet 3000 auch so glücklich? Erwäge, deinem Computer-Zuhälter ein Trinkgeld zu geben. So kann er dafür sorgen, dass dein Computerslet 3000 weiterhin ihre Arbeit macht.',
    'donation.amount': 'Spendenbetrag',
    'donation.custom': 'Benutzerdefinierter Betrag',
    'donation.donate': 'Spenden',
    'donation.processing': 'Verarbeitung...',
    'donation.copied': 'Kopiert!',
    'donation.copySuccess': 'Kontonummer in die Zwischenablage kopiert',
    'donation.copyError': 'Kontonummer konnte nicht kopiert werden',
    'donation.bankTransfer': 'Banküberweisung (kostenlos)',
    'donation.bankDesc': 'Überweisung auf unser belgisches KBC-Konto',
    'donation.accountNumber': 'Kontonummer:',
    'donation.reference': 'Im Verwendungszweck erwähnen: "Spende Computerslet 3000"',
    'donation.onlinePayment': 'Online-Zahlung (Stripe)',
    'donation.onlineDesc': 'Sicher zahlen mit Kreditkarte, Bancontact oder anderen Zahlungsmethoden',
    'donation.invalidAmount': 'Ungültiger Betrag',
    'donation.minAmount': 'Geben Sie einen gültigen Betrag ein (mindestens €1)',
    'donation.stripeNotice': '* Online-Zahlungen werden von Stripe verarbeitet. Es können Transaktionsgebühren anfallen.',
    'donation.thankYou': 'Danke für deine Unterstützung! ❤️',
    'donation.helpText': 'Dein Beitrag hilft uns, Computerslet 3000 zu verbessern.',
    'donation.processError': 'Ein Fehler ist bei der Verarbeitung der Spende aufgetreten',
    
    // Donation success
    'donationSuccess.title': 'Danke für deine Spende!',
    'donationSuccess.description': 'Deine Zahlung wurde erfolgreich verarbeitet. Wir schätzen deine Unterstützung sehr!',
    'donationSuccess.helpText': 'Dein Beitrag hilft uns, Computerslet 3000 weiter zu entwickeln und zu verbessern.',
    'donationSuccess.backButton': 'Zurück zu Computerslet 3000',
    'donationSuccess.autoRedirect': 'Du wirst automatisch in 10 Sekunden weitergeleitet...',
    
    // Common
    'common.home': 'Startseite',
    'common.error': 'Ein Fehler ist aufgetreten',
    'common.success': 'Erfolgreich',
    
    // Export/Import
    'export.success': '📤 Export abgeschlossen',
    'export.successDesc': 'Deine Kacheln wurden in eine JSON-Datei exportiert.',
    'import.success': '📥 Import abgeschlossen',
    'import.successDesc': 'Kacheln importiert.',
    'import.error': 'Import-Fehler',
    'import.errorDesc': 'Die Datei konnte nicht gelesen werden. Überprüfe das Format.',
    
    // Logout
    'logout.success': 'Auf Wiedersehen!',
    'logout.successDesc': 'Du hast dich erfolgreich abgemeldet.',
    'logout.error': 'Abmeldefehler',
    
    // 404
    'notFound.title': '404',
    'notFound.description': 'Oops! Seite nicht gefunden',
    'notFound.backLink': 'Zurück zur Startseite',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'nl';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};