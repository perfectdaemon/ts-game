/**
 * Loads data from multiple sources
 */
export class AssetLoader {
  /**
   * Returns inner HTML of element with provided @param elementId
   * Return empty string if no element found
   */
  public static getElementDataOrEmpty(elementId: string): string {
    const element = document.getElementById(elementId) as HTMLElement;

    if (!element) {
      return '';
    }

    return element.innerHTML;
  }

  /**
   * Requests text data from url
   * @param url
   */
  public static getTextFromUrl(url: string): Promise<string> {
    return new Promise<string>((resolve: any, reject: any) => {

      const request = new XMLHttpRequest();
      request.open('get', url);

      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          resolve(request.response as string);
        } else {
          reject({
            status: request.status,
            statusText: request.statusText,
          });
        }
      };

      request.onerror = () => {
        reject({
          status: request.status,
          statusText: request.statusText,
        });
      };

      request.send();
    });
  }

  /**
   * Requests strongly typed data from url
   * @param url
   */
  public static getJSONFromUrl<T>(url: string): Promise<T> {
    return this.getTextFromUrl(url)
      .then(result => JSON.parse(result) as T);
  }
}
