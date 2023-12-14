export function dateToString(input: Date): string {
    const date = new Date(input);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    let ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    const hour = date.getHours() > 12 ? `${date.getHours() - 12}` : `${date.getHours()}`;
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;

    return `${month}/${day}/${year} ${hour}:${minutes} ${ampm}`;
}

