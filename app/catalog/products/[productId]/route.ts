import { NextRequest, NextResponse } from 'next/server';

const COLOR_OPTION_ID = 1;
const SIZE_OPTION_ID = 2;

interface OptionValue {
  id: number;
  label: string;
  option_id: number;
  option_display_name: string;
}

interface Variant {
  id: number;
  product_id: number;
  sku: string;
  price: number | null;
  calculated_price: number;
  calculated_weight: number;
  inventory_level: number;
  option_values: OptionValue[];
}

interface ProductDef {
  name: string;
  sku: string;
  price: number;
  sale_price: number | null;
  weight: number;
  description: string;
  colors: { id: number; label: string; code: string }[];
  sizes: { id: number; label: string }[];
  inventory: Record<string, number>; // `${colorCode}-${sizeLabel}` → inventory
}

const PRODUCTS: Record<number, ProductDef> = {
  143: {
    name: 'Aero One',
    sku: 'HYB-AERO-143',
    price: 3299,
    sale_price: 2969.10,
    weight: 7.2,
    description: '<p>The Aero One is our flagship road racing machine. Every gram is justified, every curve optimised in the wind tunnel.</p>',
    colors: [
      { id: 11, label: 'Signal Red', code: 'RE' },
      { id: 12, label: 'Carbon Black', code: 'BK' },
      { id: 13, label: 'Pearl White', code: 'WH' },
    ],
    sizes: [
      { id: 21, label: 'S' },
      { id: 22, label: 'M' },
      { id: 23, label: 'L' },
      { id: 24, label: 'XL' },
    ],
    inventory: {
      'RE-S': 4, 'RE-M': 8, 'RE-L': 6, 'RE-XL': 3,
      'BK-S': 5, 'BK-M': 12, 'BK-L': 9, 'BK-XL': 4,
      'WH-S': 2, 'WH-M': 7, 'WH-L': 5, 'WH-XL': 1,
    },
  },
  112: {
    name: 'Commuter S',
    sku: 'HYB-COMM-112',
    price: 1899,
    sale_price: null,
    weight: 11.4,
    description: '<p>Commuter S strips away everything unnecessary. What remains is the fastest, most reliable way to move through the city.</p>',
    colors: [
      { id: 14, label: 'Midnight Black', code: 'BK' },
      { id: 15, label: 'Steel Blue', code: 'BL' },
      { id: 16, label: 'Chalk White', code: 'WH' },
    ],
    sizes: [
      { id: 21, label: 'S' },
      { id: 22, label: 'M' },
      { id: 23, label: 'L' },
      { id: 24, label: 'XL' },
    ],
    inventory: {
      'BK-S': 10, 'BK-M': 18, 'BK-L': 14, 'BK-XL': 7,
      'BL-S': 6,  'BL-M': 11, 'BL-L': 9,  'BL-XL': 3,
      'WH-S': 4,  'WH-M': 8,  'WH-L': 6,  'WH-XL': 2,
    },
  },
  140: {
    name: 'Volt E1',
    sku: 'HYB-VOLT-140',
    price: 4499,
    sale_price: null,
    weight: 22.5,
    description: '<p>The Volt E1 redefines what an e-bike can be. With a 750Wh battery and intelligent motor management, range anxiety is a thing of the past.</p>',
    colors: [
      { id: 17, label: 'Graphite Grey', code: 'GR' },
      { id: 18, label: 'Forest Green', code: 'GN' },
      { id: 19, label: 'Storm Blue', code: 'SB' },
    ],
    sizes: [
      { id: 21, label: 'S' },
      { id: 22, label: 'M' },
      { id: 23, label: 'L' },
      { id: 24, label: 'XL' },
    ],
    inventory: {
      'GR-S': 3, 'GR-M': 9,  'GR-L': 7,  'GR-XL': 4,
      'GN-S': 5, 'GN-M': 10, 'GN-L': 8,  'GN-XL': 3,
      'SB-S': 2, 'SB-M': 6,  'SB-L': 4,  'SB-XL': 0,
    },
  },
  141: {
    name: 'Terra',
    sku: 'HYB-TERR-141',
    price: 2799,
    sale_price: null,
    weight: 9.1,
    description: '<p>Terra goes where other bikes won\'t. Titanium frame, wide tyre clearance, and SRAM AXS wireless shifting for when the road runs out.</p>',
    colors: [
      { id: 20, label: 'Titanium Silver', code: 'SI' },
      { id: 21, label: 'Matte Black', code: 'BK' },
      { id: 22, label: 'Terracotta', code: 'TC' },
    ],
    sizes: [
      { id: 21, label: 'S' },
      { id: 22, label: 'M' },
      { id: 23, label: 'L' },
      { id: 24, label: 'XL' },
    ],
    inventory: {
      'SI-S': 3, 'SI-M': 7,  'SI-L': 5,  'SI-XL': 2,
      'BK-S': 4, 'BK-M': 9,  'BK-L': 7,  'BK-XL': 3,
      'TC-S': 2, 'TC-M': 5,  'TC-L': 3,  'TC-XL': 1,
    },
  },
};

function buildVariants(productId: number, def: ProductDef): Variant[] {
  const variants: Variant[] = [];
  let variantId = productId * 100;

  for (const color of def.colors) {
    for (const size of def.sizes) {
      variantId++;
      const key = `${color.code}-${size.label}`;
      const inventoryLevel = def.inventory[key] ?? 0;

      variants.push({
        id: variantId,
        product_id: productId,
        sku: `${def.sku}-${color.code}-${size.label}`,
        price: null,
        calculated_price: def.sale_price ?? def.price,
        calculated_weight: def.weight,
        inventory_level: inventoryLevel,
        option_values: [
          {
            id: color.id,
            label: color.label,
            option_id: COLOR_OPTION_ID,
            option_display_name: 'Color',
          },
          {
            id: size.id,
            label: size.label,
            option_id: SIZE_OPTION_ID,
            option_display_name: 'Size',
          },
        ],
      });
    }
  }

  return variants;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId: productIdStr } = await params;
  const productId = parseInt(productIdStr, 10);
  const def = PRODUCTS[productId];

  if (!def) {
    return NextResponse.json(
      { errors: [{ status: 404, title: 'Product not found' }] },
      { status: 404 },
    );
  }

  const variants = buildVariants(productId, def);
  const totalInventory = variants.reduce((sum, v) => sum + v.inventory_level, 0);

  return NextResponse.json({
    data: {
      id: productId,
      name: def.name,
      sku: def.sku,
      type: 'physical',
      price: def.price,
      calculated_price: def.sale_price ?? def.price,
      sale_price: def.sale_price,
      weight: def.weight,
      description: def.description,
      categories: [10],
      brand_id: 1,
      inventory_level: totalInventory,
      inventory_tracking: 'variant',
      availability: totalInventory > 0 ? 'available' : 'preorder',
      variants,
    },
    meta: {
      pagination: {
        total: 1,
        count: 1,
        per_page: 1,
        current_page: 1,
        total_pages: 1,
      },
    },
  });
}
