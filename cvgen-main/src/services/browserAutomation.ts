/**
 * Version navigateur du service d'automatisation
 * Cette version est compatible avec le navigateur et n'utilise pas Puppeteer
 * car c'est une bibliothèque Node.js qui ne peut pas être utilisée côté client
 */

// Interface de la classe (pour la compatibilité avec le code existant)
export interface BrowserInterface {
  initialize(): Promise<void>;
  navigateTo(url: string): Promise<void>;
  closePopups(): Promise<void>;
  close(): Promise<void>;
}

/**
 * Version compatible navigateur qui simule les fonctionnalités
 * mais affiche seulement des messages d'information
 */
class BrowserAutomationService implements BrowserInterface {
  
  /**
   * Initialise le service
   */
  async initialize(): Promise<void> {
    console.log("Initialisation du service d'automatisation (version navigateur)");
    return Promise.resolve();
  }
  
  /**
   * Simule la navigation
   */
  async navigateTo(url: string): Promise<void> {
    console.log(`Navigation simulée vers ${url}`);
    return Promise.resolve();
  }
  
  /**
   * Détection des popups
   */
  async closePopups(): Promise<void> {
    console.log("Détection des popups (version navigateur)");
    
    // Dans un vrai navigateur, on pourrait ajouter un observer pour détecter 
    // les popups et les fermer automatiquement
    const detectPopupsInBrowser = () => {
      // Recherche des éléments qui pourraient être des popups
      const possiblePopups = document.querySelectorAll('.modal, [role="dialog"], .popup, .tw-bg-white.tw-shadow-xl');
      
      if (possiblePopups.length > 0) {
        console.log(`${possiblePopups.length} popups potentiels détectés`);
        
        // Tentative de fermeture des popups en cliquant sur les boutons de fermeture
        possiblePopups.forEach((popup) => {
          const closeButtons = popup.querySelectorAll(
            'button[aria-label="Close"], .close-button, .tw-absolute.tw-right-3, button:has(svg)'
          );
          
          closeButtons.forEach((button) => {
            try {
              (button as HTMLElement).click();
              console.log('Clic sur un bouton de fermeture');
            } catch (e) {
              console.error('Erreur lors du clic sur le bouton', e);
            }
          });
        });
      } else {
        console.log('Aucun popup détecté');
      }
    };
    
    // Si nous sommes dans un navigateur
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      // Essayer de détecter et fermer les popups
      detectPopupsInBrowser();
      
      // Établir un observateur pour fermer les popups qui apparaissent plus tard
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Vérifier si une popup a été ajoutée
            setTimeout(detectPopupsInBrowser, 500);
          }
        }
      });
      
      // Observer les changements dans le body
      observer.observe(document.body, { childList: true, subtree: true });
      
      // Nettoyer l'observateur après 10 secondes
      setTimeout(() => {
        observer.disconnect();
      }, 10000);
    }
    
    return Promise.resolve();
  }
  
  /**
   * Ferme le service
   */
  async close(): Promise<void> {
    console.log("Fermeture du service d'automatisation (version navigateur)");
    return Promise.resolve();
  }
}

// Exporter une instance unique du service
export const browserAutomation = new BrowserAutomationService();

// Exporter une fonction helper
export async function closeHelloWorkPopups(url: string): Promise<void> {
  try {
    await browserAutomation.initialize();
    await browserAutomation.navigateTo(url);
    await browserAutomation.closePopups();
  } catch (error) {
    console.error('Erreur lors de la fermeture des popups:', error);
  } finally {
    await browserAutomation.close();
  }
} 