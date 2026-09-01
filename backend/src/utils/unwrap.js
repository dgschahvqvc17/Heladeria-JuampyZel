// Devuelve `data` si la consulta a Supabase fue exitosa;
// de lo contrario lanza el error devuelto por PostgREST.
function unwrap(result) {
    if (result.error) throw result.error;
    return result.data;
}

module.exports = { unwrap };