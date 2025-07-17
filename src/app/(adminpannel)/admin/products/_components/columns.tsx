"use client"
import { ColumnDef, Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Copy, Edit, MoreVertical, Trash2, Tv } from "lucide-react";
import { formatIndianCurrency } from "@/lib/helper";
import { TooltipButton } from "@/components/custom/tooltip-button";
import { useRouter } from "next/navigation";
import { toast } from "@/components/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { DeleteDialog } from "./delete-dialog";
import Image from "next/image";
import { IProduct } from "@/schemas/productsSchema";
import { updateProductSection } from "@/services/product.services";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const ActionsCell = ({ row }: { row: Row<IProduct> }) => {
  const product = row.original;
  const router = useRouter();

  const handleClone = async () => {
    try {
      const response = await fetch("/api/products/clone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ originalId: product._id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to clone product");
      }

      toast({
        title: "Success",
        description: "Product cloned successfully",
      });

      router.push(`/admin/products/${result.data.basicInfo?.slug}`);
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to clone product",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">More actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/products/${product.basicInfo?.slug}`} className="w-full">
            <Edit className="mr-2 h-4 w-4 text-blue-600" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/product/${product.basicInfo?.slug}`} target="_blank" className="w-full">
            <Tv className="mr-2 h-4 w-4 text-yellow-600" />
            View Live
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleClone}>
          <Copy className="mr-2 h-4 w-4 text-green-600" />
          Clone
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => {
          e.preventDefault();
          document.getElementById('delete-dialog-trigger')?.click();
        }}>
          <>
            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
            Delete
            <DeleteDialog id={product._id || ""}>
              <button id="delete-dialog-trigger" className="hidden" />
            </DeleteDialog>
          </>

        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu >
  );
};


const ActiveInActiveCell = ({ row }: { row: Row<IProduct> }) => {
  const router = useRouter();
  const product = row.original;

  const handleStatusToggle = async (isActive: boolean) => {
    try {
      if (!product.basicInfo?.slug) {
        throw new Error("Product slug is missing");
      }

      const response = await updateProductSection(
        product.basicInfo.slug,
        'flags',
        { isActive }
      );

      if (!response.success) {
        throw new Error(response.error);
      }

      toast({
        title: "Success",
        description: `Product ${isActive ? "is active" : "is inactive"}`,
      });

      router.refresh();
    } catch (error) {
      console.error(`ERROR : ${error}`)
      toast({
        title: "Error",
        description: `Failed to update product status `,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={product.flags?.isActive}
        onCheckedChange={handleStatusToggle}
        id={`product-status-switch-${product.basicInfo?.slug}`}
        title={`${product.flags?.isActive ? "Hide Product" : "Go Live"}`}
      />
    </div>
  );
}

export const columns: ColumnDef<IProduct>[] = [
  {
    accessorKey: "media.mainImage",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.original.media?.mainImage;
      return (
        <TooltipButton
          tooltipContent={
            <div>
              <Image
                width={200}
                height={200}
                src={imageUrl || ""}
                alt="Product preview"
                className="max-w-[200px] max-h-[200px] object-contain rounded-md border bg-white"
              />
            </div>
          }
          variant="outline"
        >
          <Image
            height={40}
            width={40}
            src={imageUrl || ""}
            alt="Product thumbnail"
            className=" object-cover rounded-md border cursor-pointer"
          />
        </TooltipButton>
      );
    },
  },
  {
    accessorKey: "basicInfo.name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/admin/products/${row.original.basicInfo?.slug}`}
        className="font-medium hover:text-brand hover:font-bold hover:underline whitespace-nowrap"
      >
        {row.original.basicInfo?.name}
      </Link>
    ),
  },
  {
    accessorKey: "pricing.price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(`${row.original.pricing?.price}` || "0");
      const formatted = formatIndianCurrency(price);

      return <div className="flex justify-center">{formatted}</div>;
    },
  },
  {
    accessorKey: "inventory.stockQuantity",
    header: "Stock Quantity",
    cell: ({ row }) => {
      const product = row.original;
      const inStock = row.original.inventory?.inStock;
      return (
        <div className="flex justify-center">
          <Badge className={`cursor-default ${inStock ? "bg-green-500" : "bg-red-400"}`}>
            {product.inventory?.stockQuantity}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "inventory.inStock",
    header: "Stock Status",
    cell: ({ row }) => {
      const inStock = row.original.inventory?.inStock;
      return (
        <div className="flex justify-center">
          <Badge variant={inStock ? "default" : "destructive"} className="whitespace-nowrap">
            {inStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "flags.isActive",
    header: "Status",
    cell: ({ row }) => <ActiveInActiveCell row={row} />
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />

  },
];