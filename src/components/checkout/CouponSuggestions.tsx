import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { inr } from "@/lib/haston-data";
import { ApiError } from "@/lib/api-client";
import { hastonApi, type CouponSuggestion } from "@/lib/haston-api";

type CouponSuggestionsProps = {
  cartKey: string;
  userId: number | null;
  appliedCode?: string | null;
  applyingCode?: string | null;
  onApply: (couponCode: string) => void;
};

export function CouponSuggestions({
  cartKey,
  userId,
  appliedCode,
  applyingCode,
  onApply,
}: CouponSuggestionsProps) {
  const suggestionsQuery = useQuery({
    queryKey: ["haston", "coupon-suggestions", userId, cartKey],
    queryFn: hastonApi.couponSuggestions,
    enabled: userId !== null && Boolean(cartKey),
    staleTime: 0,
    refetchOnMount: "always",
  });

  return (
    <section className="mt-6 border-t border-border pt-5" aria-labelledby="coupon-suggestions-title">
      <div className="flex items-center justify-between gap-3">
        <h2 id="coupon-suggestions-title" className="text-eyebrow">
          Offers for you
        </h2>
        {suggestionsQuery.isFetching && !suggestionsQuery.isPending && (
          <span className="text-[10px] text-muted-foreground">Updating</span>
        )}
      </div>

      {userId === null ? (
        <p className="mt-3 text-xs text-muted-foreground">
          <Link to="/login" className="text-primary underline underline-offset-4">
            Sign in
          </Link>{" "}
          to see eligible offers.
        </p>
      ) : suggestionsQuery.isPending ? (
        <p role="status" className="mt-3 text-xs text-muted-foreground">
          Finding eligible offers...
        </p>
      ) : suggestionsQuery.isError ? (
        suggestionsQuery.error instanceof ApiError && suggestionsQuery.error.status === 401 ? (
          <p role="alert" className="mt-3 text-xs text-muted-foreground">
            Your session has expired. <Link to="/login" className="text-primary underline underline-offset-4">Sign in</Link> to view offers.
          </p>
        ) : (
          <div className="mt-3 flex items-center justify-between gap-3">
            <p role="alert" className="text-xs text-muted-foreground">
              Offers could not be loaded.
            </p>
            <button
              type="button"
              onClick={() => void suggestionsQuery.refetch()}
              disabled={suggestionsQuery.isFetching}
              className="text-[10px] uppercase tracking-[0.18em] text-primary underline underline-offset-4 disabled:opacity-50"
            >
              Try again
            </button>
          </div>
        )
      ) : !suggestionsQuery.data?.length ? (
        <p className="mt-3 text-xs text-muted-foreground">
          No eligible offers for this bag right now.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {suggestionsQuery.data.map((suggestion) => (
            <CouponOffer
              key={suggestion.code}
              suggestion={suggestion}
              isApplied={sameCouponCode(appliedCode, suggestion.code)}
              isApplying={sameCouponCode(applyingCode, suggestion.code)}
              onApply={onApply}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function CouponOffer({
  suggestion,
  isApplied,
  isApplying,
  onApply,
}: {
  suggestion: CouponSuggestion;
  isApplied: boolean;
  isApplying: boolean;
  onApply: (couponCode: string) => void;
}) {
  const discountDescription =
    suggestion.discountType === "PERCENTAGE"
      ? `${suggestion.value}% off${suggestion.maxDiscount == null ? "" : `, up to ${inr(suggestion.maxDiscount)}`}`
      : `${inr(suggestion.value)} off`;
  const details = [
    suggestion.minOrderValue == null ? null : `Min. spend ${inr(suggestion.minOrderValue)}`,
    suggestion.allowFreeShipping ? "Complimentary shipping" : null,
  ].filter((detail): detail is string => detail !== null);

  return (
    <li className="rounded-md border border-border bg-secondary/30 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <span className="inline-flex rounded-sm bg-mustard/20 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-primary">
            {suggestion.code}
          </span>
          <p className="mt-2 text-sm font-medium text-foreground">{discountDescription}</p>
          {details.length > 0 && (
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {details.join(" · ")}
            </p>
          )}
          <p className="mt-1 text-[10px] text-muted-foreground">{suggestion.message}</p>
        </div>
        <button
          type="button"
          onClick={() => onApply(suggestion.code)}
          disabled={isApplied || isApplying}
          className="shrink-0 rounded-md border border-primary px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-55"
        >
          {isApplied ? "Applied" : isApplying ? "Checking..." : "Apply"}
        </button>
      </div>
    </li>
  );
}

function sameCouponCode(left: string | null | undefined, right: string) {
  return left?.trim().toUpperCase() === right.trim().toUpperCase();
}