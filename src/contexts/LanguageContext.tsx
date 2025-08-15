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
    
    // Donation
    'donation.title': 'Steun Computerslet 3000',
    'donation.description': 'Maakt de Computerslet 3000 jou ook zo gelukkig? Overweeg dan om je Computerpimp een fooi te geven. Zo kan hij ervoor zorgen dat je Computerslet 3000 haar werk zal blijven doen.',
    'donation.amount': 'Donatiebedrag',
    'donation.custom': 'Aangepast bedrag',
    'donation.donate': 'Doneren',
    'donation.processing': 'Bezig met verwerken...',
    
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
    
    // Donation
    'donation.title': 'Support Computerslet 3000',
    'donation.description': 'Does Computerslet 3000 make you happy too? Consider giving your Computer pimp a tip. This way he can ensure that your Computerslet 3000 will continue to do her work.',
    'donation.amount': 'Donation amount',
    'donation.custom': 'Custom amount',
    'donation.donate': 'Donate',
    'donation.processing': 'Processing...',
    
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
    
    // Donation
    'donation.title': 'Soutenez Computerslet 3000',
    'donation.description': 'Computerslet 3000 vous rend-il heureux aussi ? Pensez à donner un pourboire à votre Pimp informatique. Ainsi, il peut s\'assurer que votre Computerslet 3000 continuera à faire son travail.',
    'donation.amount': 'Montant du don',
    'donation.custom': 'Montant personnalisé',
    'donation.donate': 'Faire un don',
    'donation.processing': 'Traitement en cours...',
    
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
    
    // Donation
    'donation.title': 'Apoya Computerslet 3000',
    'donation.description': '¿Computerslet 3000 también te hace feliz? Considera darle una propina a tu Proxeneta informático. Así puede asegurar que tu Computerslet 3000 siga haciendo su trabajo.',
    'donation.amount': 'Cantidad de donación',
    'donation.custom': 'Cantidad personalizada',
    'donation.donate': 'Donar',
    'donation.processing': 'Procesando...',
    
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
    
    // Donation
    'donation.title': 'Sostieni Computerslet 3000',
    'donation.description': 'Computerslet 3000 ti rende felice anche tu? Considera di dare una mancia al tuo Magnaccia informatico. Così può assicurarsi che il tuo Computerslet 3000 continui a fare il suo lavoro.',
    'donation.amount': 'Importo donazione',
    'donation.custom': 'Importo personalizzato',
    'donation.donate': 'Dona',
    'donation.processing': 'Elaborazione...',
    
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
    
    // Donation
    'donation.title': 'Unterstütze Computerslet 3000',
    'donation.description': 'Macht dich Computerslet 3000 auch so glücklich? Erwäge, deinem Computer-Zuhälter ein Trinkgeld zu geben. So kann er dafür sorgen, dass dein Computerslet 3000 weiterhin ihre Arbeit macht.',
    'donation.amount': 'Spendenbetrag',
    'donation.custom': 'Benutzerdefinierter Betrag',
    'donation.donate': 'Spenden',
    'donation.processing': 'Verarbeitung...',
    
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