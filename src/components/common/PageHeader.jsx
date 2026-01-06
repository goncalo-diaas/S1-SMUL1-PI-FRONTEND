import { useWindowSize } from "../../hooks/useWindowSize";

export default function PageHeader({ title, subtitle, icon: Icon, actionButton }) {
    const { width: windowWidth } = useWindowSize();
    
    return (
        <div style={{
            backgroundColor: '#63b099',
            color: 'white',
            padding: windowWidth <= 480 ? '20px 16px' : '24px 40px'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: windowWidth <= 768 ? 'column' : 'row',
                gap: windowWidth <= 768 ? '16px' : '0',
                justifyContent: 'space-between',
                alignItems: windowWidth <= 768 ? 'stretch' : 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {Icon && <Icon size={windowWidth <= 480 ? 24 : 32} />}
                    <div>
                        <h1 style={{ 
                            margin: 0, 
                            fontSize: windowWidth <= 480 ? '22px' : '28px', 
                            fontWeight: '600' 
                        }}>
                            {title}
                        </h1>
                        {subtitle && (
                            <p style={{ 
                                margin: 0, 
                                fontSize: '14px', 
                                opacity: 0.9 
                            }}>
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
                <div style={{ width: windowWidth <= 768 ? '100%' : 'auto' }}>
                    {actionButton}
                </div>
            </div>
        </div>
    );
}
