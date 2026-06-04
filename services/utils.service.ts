interface QueryParams {
  [key: string]: string | number | boolean | null | undefined | Date;
}

class UtilService {
  private build_query(params: QueryParams): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      // Skip null, undefined, and empty strings
      if (value === null || value === undefined || value === "") {
        return;
      }

      // Convert boolean to string
      if (typeof value === "boolean") {
        searchParams.append(key, value.toString());
        return;
      }

      // Convert number to string
      if (typeof value === "number") {
        searchParams.append(key, value.toString());
        return;
      }

      // Handle Date objects
      if (value instanceof Date) {
        searchParams.append(key, value.toISOString());
        return;
      }

      // Handle string values
      searchParams.append(key, value);
    });

    return searchParams.toString();
  }

  buildQuery(params: QueryParams): string {
    return this.build_query(params);
  }

  /**
   * Safely parse payment info from invoice data
   * Handles both object and string inputs for paymentInfo
   * @param paymentInfo - The payment info data (object or string)
   * @returns Valid payment info object or empty string
   */
  parsePaymentInfo(paymentInfo: any): string | object {
    if (!paymentInfo) return "";

    try {
      // If it's already an object, use it directly
      if (typeof paymentInfo === "object") {
        return Object.keys(paymentInfo).length > 0 ? paymentInfo : "";
      }
      // If it's a string, try to parse it
      const parsed = JSON.parse(paymentInfo as string);
      return Object.keys(parsed).length > 0 ? paymentInfo : "";
    } catch (error) {
      // If parsing fails, return empty string
      return "";
    }
  }
}

export const utilService = new UtilService();
