export default function ProductHuntBadge() {
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', border: '1px solid rgb(224, 224, 224)', borderRadius: '12px', padding: '20px', maxWidth: '500px', background: 'rgb(255, 255, 255)', boxShadow: 'rgba(0, 0, 0, 0.05) 0px 2px 8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <img alt="Vibelly" src="https://ph-files.imgix.net/cbe005fd-72f7-49cb-8d37-0a85dd34a571.jpeg?auto=compress,format&codec=mozjpeg&cs=strip&fit=crop&h=80&w=80" style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
        <div style={{ flex: '1 1 0%', minWidth: '0px' }}>
          <h3 style={{ margin: '0px', fontSize: '18px', fontWeight: 600, color: 'rgb(26, 26, 26)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Vibelly</h3>
          <p style={{ margin: '4px 0px 0px', fontSize: '14px', color: 'rgb(102, 102, 102)', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>Best free omegle alternative for random video and audio call</p>
        </div>
      </div>
      <a href="https://www.producthunt.com/products/vibelly?embed=true&utm_source=embed&utm_medium=post_embed" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '12px', padding: '8px 16px', background: 'rgb(255, 97, 84)', color: 'rgb(255, 255, 255)', textDecoration: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>Check it out on Product Hunt →</a>
    </div>
  );
}
