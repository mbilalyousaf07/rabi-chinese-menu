export function matchesName(item, query) {
 return item.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
}
export function selectMenu(data, category = 'all', query = '') {
 return {
  categories: data.categories.filter(c => category === 'all' || category === c.id).map(c => ({...c, items:c.items.filter(i => matchesName(i, query))})).filter(c => c.items.length),
  deals: category === 'all' || category === 'deals' ? data.deals.filter(d => matchesName(d, query)) : []
 };
}
export const rupees = value => `Rs. ${new Intl.NumberFormat('en-PK').format(value)}`;
export function validMenu(data) {
 return data && Array.isArray(data.categories) && Array.isArray(data.deals) && data.categories.length > 0 && data.categories.every(c => typeof c.id === 'string' && typeof c.name === 'string' && Array.isArray(c.items) && c.items.every(i => typeof i.name === 'string' && (Number.isFinite(i.price) || (Array.isArray(i.variants) && i.variants.length > 0 && i.variants.every(v => typeof v.label === 'string' && Number.isFinite(v.price)))))) && data.deals.every(d => typeof d.name === 'string' && Number.isFinite(d.price) && Array.isArray(d.items));
}
