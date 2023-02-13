export const dataArrayToSelectOptions = data => {
    return data.map(
        (item) => {
            return {
                label: ( 'name' in item ) ? item.name : `${item.first_name} ${item.last_name}` ,
                value: item.id,
            };
        }
    );
}