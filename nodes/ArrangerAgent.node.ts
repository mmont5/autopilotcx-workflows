import { INodeExecutionData, INodeType, INodeTypeDescription, IExecuteFunctions } from 'n8n-workflow';

export class ArrangerAgent implements INodeType {
  description: INodeTypeDescription = {
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

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const mergedData = items[i].json.mergedData;
      
      if (!mergedData || typeof mergedData !== 'object') {
        throw new Error('Merged data is not a valid object');
      }
      
      const merged = mergedData as any;
      
      // Transform the data to match Supabase schema
      const transformedData = {
        id: merged.clientData.id || undefined,
        company_name: merged.clientData.company_name,
        logo: merged.siteData.logo || merged.placesData.photos?.[0]?.photo_reference,
        tagline: merged.siteData.tagline,
        owner: merged.siteData.owner?.name,
        ownerTitle: merged.siteData.owner?.title,
        ownerBio: merged.siteData.owner?.bio,
        ownerImageUrl: merged.siteData.owner?.image,
        company_phone: merged.placesData.formatted_phone_number || merged.siteData.contact?.phone,
        company_email: merged.siteData.contact?.email,
        website: merged.clientData.website,
        locations: merged.placesData.locations?.map((loc: any) => ({
          name: loc.name,
          address: loc.formatted_address,
          phone: loc.formatted_phone_number,
          hours: loc.opening_hours?.weekday_text,
          lat: loc.geometry?.location?.lat,
          lng: loc.geometry?.location?.lng,
        })) || [],
        category_ids: Array.isArray(merged.clientData.category_ids) ? merged.clientData.category_ids : merged.clientData.category_id ? [merged.clientData.category_id] : [],
        industry_id: merged.clientData.industry_id,
        social_accounts: merged.siteData.social,
        metadata: {
          staff: merged.siteData.staff?.map((staff: any) => ({
            name: staff.name,
            title: staff.title,
            bio: staff.bio,
            image: staff.image,
          })) || [],
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