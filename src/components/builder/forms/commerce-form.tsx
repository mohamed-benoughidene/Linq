import { useState } from "react"
import { z } from "zod"
import { BuilderBlock, useBuilderStore } from "@/store/builder-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { SizeSelector, BlockVariant } from "../editors/size-selector"
import { Trash2 } from "lucide-react"

// Zod Schema
const commerceSchema = z.object({
    buttonUrl: z.string().url("Invalid URL").startsWith("https", "Must use HTTPS"),
    price: z.string().regex(/^\d+(\.\d{0,2})?$/, "Price must be a number (e.g. 10.00)")
})

interface CommerceFormProps {
    id: string
    data: BuilderBlock['content']
}

export function CommerceForm({ id, data }: CommerceFormProps) {
    const { updateBlock, blocks, updateLayout } = useBuilderStore()
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    // Helper for validation
    const validateField = (field: 'buttonUrl' | 'price', value: string) => {
        try {
            commerceSchema.shape[field].parse(value)
            setErrors(prev => ({ ...prev, [field]: "" }))
            return true
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(prev => ({ ...prev, [field]: (error as z.ZodError).issues[0].message }))
            }
            return false
        }
    }

    const handleChange = (field: keyof BuilderBlock['content'], value: string) => {
        // Validation logic for specific fields
        if (field === 'productUrl') {
            validateField('buttonUrl', value)
        }
        if (field === 'price') {
            validateField('price', value)
        }

        updateBlock(id, { [field]: value } as any)
    }

    const handleSizeChange = (newVariant: BlockVariant) => {
        let w = 6
        let h = 5 // Default for Commerce

        switch (newVariant) {
            case 'square': w = 2; h = 4; break;
            case 'wide': w = 4; h = 2; break;
            case 'hero': w = 6; h = 5; break;
        }

        updateBlock(id, { variant: newVariant })

        // Update Layout (Direct logic from block-renderer, duplicated here or we could pass a handler)
        // Ideally block-renderer passes a "onSizeChange" handler, but trying to follow independence.
        // I will use direct store access as it's cleaner for a separated component.
        const newLayouts = blocks.map(b =>
            b.id === id ? { ...b.layout, w, h } : b.layout
        )
        updateLayout(newLayouts)
    }

    return (
        <div className="space-y-4">
            <SizeSelector
                currentVariant={data.variant || 'hero'}
                onSelect={handleSizeChange}
                allowedVariants={['hero', 'wide']}
            />

            {/* Title */}
            <div className="space-y-2">
                <Label>Product Title</Label>
                <Input
                    value={data.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="e.g. Digital Guide"
                    data-id="commerce-form-title"
                />
            </div>

            {/* Price & Currency */}
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                    <Label>Price</Label>
                    <Input
                        value={data.price || ''}
                        onChange={(e) => handleChange('price', e.target.value)}
                        placeholder="10.00"
                        className={errors.price ? "border-red-500" : ""}
                        data-id="commerce-form-price"
                    />
                    {errors.price && <p className="text-[10px] text-red-500">{errors.price}</p>}
                </div>
                <div className="space-y-2">
                    <Label>Currency</Label>
                    <select
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={data.currency}
                        onChange={(e) => handleChange('currency', e.target.value)}
                        data-id="commerce-form-currency"
                    >
                        <option value="$">USD ($)</option>
                        <option value="€">EUR (€)</option>
                        <option value="£">GBP (£)</option>
                    </select>
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                    value={data.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="h-20"
                    placeholder="Describe your product..."
                    data-id="commerce-form-description"
                />
            </div>

            {/* Button Text */}
            <div className="space-y-2">
                <Label>Button Text</Label>
                <Input
                    value={data.buttonText || ''}
                    onChange={(e) => handleChange('buttonText', e.target.value)}
                    placeholder="Buy Now"
                    data-id="commerce-form-button-text"
                />
            </div>

            {/* Checkout URL */}
            <div className="space-y-2">
                <Label>Checkout URL</Label>
                <Input
                    value={data.productUrl || ''}
                    onChange={(e) => handleChange('productUrl', e.target.value)}
                    placeholder="https://gumroad.com/..."
                    className={errors.buttonUrl ? "border-red-500" : ""}
                    data-id="commerce-form-url"
                />
                {errors.buttonUrl && <p className="text-[10px] text-red-500">{errors.buttonUrl}</p>}
            </div>

            {/* Image URL (Simple for now as per plan) */}
            <div className="space-y-2">
                <Label>Image URL</Label>
                <div className="flex gap-2">
                    <Input
                        value={data.image || ''}
                        onChange={(e) => handleChange('image', e.target.value)}
                        placeholder="https://..."
                        data-id="commerce-form-image"
                    />
                    {data.image && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleChange('image', '')}
                            title="Remove Image"
                        >
                            <Trash2 className="w-4 h-4 text-slate-500" />
                        </Button>
                    )}
                </div>
                {data.image && (
                    <div className="h-20 w-full bg-slate-100 rounded overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={data.image} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                )}
            </div>
        </div>
    )
}
