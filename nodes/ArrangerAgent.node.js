"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrangerAgent = void 0;
class ArrangerAgent {
    constructor() {
        this.description = {
            displayName: 'ArrangerAgent',
            name: 'arrangerAgent',
            icon: 'file:arranger.svg',
            group: ['transform'],
            version: 1,
            description: 'Transform enriched data for Supabase',
            defaults: {
                name: 'Data Transformer',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    options: [
                        {
                            name: 'Transform for Supabase',
                            value: 'transformForSupabase',
                        },
                    ],
                    default: 'transformForSupabase',
                },
            ],
        };
    }
    async execute() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            const mergedData = items[i].json.mergedData;
            if (!mergedData || typeof mergedData !== 'object') {
                throw new Error('Merged data is not a valid object');
            }
            const merged = mergedData;
            // Transform the data to match Supabase schema
            const transformedData = {
                id: merged.clientData.id || undefined,
                company_name: merged.clientData.company_name,
                logo: merged.siteData.logo || ((_b = (_a = merged.placesData.photos) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.photo_reference),
                tagline: merged.siteData.tagline,
                owner: (_c = merged.siteData.owner) === null || _c === void 0 ? void 0 : _c.name,
                ownerTitle: (_d = merged.siteData.owner) === null || _d === void 0 ? void 0 : _d.title,
                ownerBio: (_e = merged.siteData.owner) === null || _e === void 0 ? void 0 : _e.bio,
                ownerImageUrl: (_f = merged.siteData.owner) === null || _f === void 0 ? void 0 : _f.image,
                company_phone: merged.placesData.formatted_phone_number || ((_g = merged.siteData.contact) === null || _g === void 0 ? void 0 : _g.phone),
                company_email: (_h = merged.siteData.contact) === null || _h === void 0 ? void 0 : _h.email,
                website: merged.clientData.website,
                locations: ((_j = merged.placesData.locations) === null || _j === void 0 ? void 0 : _j.map((loc) => {
                    var _a, _b, _c, _d, _e;
                    return ({
                        name: loc.name,
                        address: loc.formatted_address,
                        phone: loc.formatted_phone_number,
                        hours: (_a = loc.opening_hours) === null || _a === void 0 ? void 0 : _a.weekday_text,
                        lat: (_c = (_b = loc.geometry) === null || _b === void 0 ? void 0 : _b.location) === null || _c === void 0 ? void 0 : _c.lat,
                        lng: (_e = (_d = loc.geometry) === null || _d === void 0 ? void 0 : _d.location) === null || _e === void 0 ? void 0 : _e.lng,
                    });
                })) || [],
                category_ids: Array.isArray(merged.clientData.category_ids) ? merged.clientData.category_ids : merged.clientData.category_id ? [merged.clientData.category_id] : [],
                industry_id: merged.clientData.industry_id,
                social_accounts: merged.siteData.social,
                metadata: {
                    staff: ((_k = merged.siteData.staff) === null || _k === void 0 ? void 0 : _k.map((staff) => ({
                        name: staff.name,
                        title: staff.title,
                        bio: staff.bio,
                        image: staff.image,
                    }))) || [],
                    services: merged.siteData.services || [],
                    testimonials: merged.siteData.testimonials || [],
                    languages: merged.siteData.languages || [],
                    insurance: merged.siteData.insurance || [],
                    awards: merged.siteData.awards || [],
                },
                status: 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            returnData.push({
                json: {
                    transformedData,
                },
            });
        }
        return [returnData];
    }
}
exports.ArrangerAgent = ArrangerAgent;
