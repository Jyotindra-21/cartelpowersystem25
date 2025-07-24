import { DataTable } from "@/components/custom/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { columns } from "./_components/columns";
import { Plus } from "lucide-react";
import { fetchProducts } from "@/services/product.services";
import { IProduct } from "@/schemas/productsSchema";

export const dynamic = 'force-dynamic'; // Force dynamic rendering
export const revalidate = 0; // 

export default async function ProductsPage() {
  const { data: product, error } = await fetchProducts<IProduct[]>({ getAll: true });
  if (error) {
    return (
      <div>
        {error}
      </div>
    )
  }
  return (
    <>
      {/* Header section - fixed height */}
      <div className="flex justify-between items-center mb-2 ">
        <h1 className="text-lg md:text-2xl font-bold">Products Management</h1>
        <Button asChild>
          <Link href="/admin/products/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </Link>
        </Button>
      </div>
      {/* Table container - should NOT have its own scroll */}
      {product && (
        <DataTable<IProduct, unknown>
          columns={columns}
          data={product}

        />
      )}
    </>
  );
}