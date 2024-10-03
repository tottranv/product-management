export const convertToLocale = (exchangeRate, amount,  locale = 'en-US', currency = 'USD', style = 'currency') => {
    const amountInCurrency = amount * exchangeRate;

    return new Intl.NumberFormat(locale, {
        style,// 'currency', 'decimal', 'percent', ...
        currency: currency ? currency : undefined,// If style is 'currency'
    }).format(amountInCurrency);
}
export const convertToLocaleAmountOnly = (exchangeRate, amount) => {
    return amount * exchangeRate;
}

// const exchangeRate = 1;
// const amount = 100;

// // 1
// const formattedAmountUSD = convertToLocale(exchangeRate, amount);
// console.log(formattedAmountUSD); // "$100.00"

// const formattedAmountEUR = convertToLocale(exchangeRate, amount, 'fr-FR', 'EUR');
// console.log(formattedAmountEUR); // "100,00 €"

// const formattedDecimal = convertToLocale(exchangeRate, amount, 'en-US', 'USD', 'decimal');
// console.log(formattedDecimal); // "100.00"

// // 2
// const formattedAmountUSDOnly = convertToLocaleAmountOnly(24500, 100);
// console.log(formattedAmountUSDOnly); // 2450000